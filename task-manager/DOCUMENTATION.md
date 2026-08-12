# Dokumentasi Proyek: Task Manager (Next.js App Router)

## 1. Cara Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:3000

---

## 2. Struktur Folder

```
task-manager/
├── app/
│   ├── layout.js              # Root layout (navbar + wrapper halaman)
│   ├── globals.css            # Import Tailwind
│   ├── page.js                # Halaman daftar tugas -> SERVER COMPONENT (SSR)
│   ├── tasks/
│   │   ├── new/
│   │   │   └── page.js        # Halaman tambah tugas -> Client Component
│   │   └── [id]/
│   │       └── page.js        # Halaman detail & edit tugas -> Client Component
│   └── api/
│       └── tasks/
│           ├── route.js       # GET (list + filter), POST (create)
│           └── [id]/
│               └── route.js   # GET, PUT, DELETE per-id
├── components/
│   ├── TaskList.jsx           # State management utama (useState/useEffect)
│   ├── TaskItem.jsx           # 1 baris tugas (reusable, controlled via props)
│   ├── TaskForm.jsx           # Form reusable (dipakai utk tambah & edit)
│   └── FilterBar.jsx          # Tombol filter status (reusable)
├── lib/
│   ├── tasks.js                # Akses data (baca/tulis JSON) - server only
│   └── axios.js                # Instance axios untuk client
├── data/
│   └── tasks.json              # "Database" sederhana berbasis file
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

**Penjelasan singkat tiap bagian:**

- **`app/`** — routing berbasis folder (App Router). Setiap folder dengan
  `page.js` otomatis menjadi sebuah halaman/URL.
- **`app/api/`** — Route Handlers, berfungsi sebagai backend REST API
  bawaan Next.js.
- **`components/`** — komponen UI yang reusable, menerima data lewat
  `props` dan mengirim event lewat callback (`onClick`, `onSubmit`, dst).
- **`lib/tasks.js`** — satu-satunya tempat yang menyentuh file JSON
  (`data/tasks.json`). Baik API routes maupun halaman SSR memanggil fungsi
  dari sini, bukan mengakses file langsung.
- **`lib/axios.js`** — instance axios dengan `baseURL: "/api"` supaya
  komponen client tidak perlu menulis ulang path lengkap setiap kali
  memanggil API.

---

## 3. Alur Data (State ↔ API Route ↔ Komponen)

### a. Saat halaman `/` (daftar tugas) pertama kali dibuka — SSR

```
Browser request "/"
      ↓
app/page.js (Server Component) dijalankan DI SERVER
      ↓
memanggil getAllTasks() dari lib/tasks.js (baca data/tasks.json langsung,
tanpa HTTP request ke API route sendiri)
      ↓
hasilnya (array tasks) dikirim sebagai HTML sudah jadi + sebagai props
`initialTasks` ke <TaskList initialTasks={tasks} />
      ↓
Browser menerima HTML yang sudah berisi daftar tugas (tanpa loading state)
```

### b. Interaksi setelah halaman dimuat (filter, toggle selesai, hapus) — Client

```
User klik filter "Selesai"
      ↓
FilterBar memanggil onChange("selesai") -> setFilter di TaskList (useState)
      ↓
useEffect di TaskList mendeteksi `filter` berubah
      ↓
axios GET /api/tasks?status=selesai
      ↓
app/api/tasks/route.js (Route Handler) memanggil getAllTasks() lalu
menyaring berdasarkan status
      ↓
Response JSON diterima axios -> setTasks(response.data) -> React re-render
```

```
User klik checkbox "tandai selesai" pada TaskItem
      ↓
TaskItem memanggil onToggleComplete(task) -> handleToggleComplete di TaskList
      ↓
axios PUT /api/tasks/:id  { status: "selesai" }
      ↓
app/api/tasks/[id]/route.js memanggil updateTask() -> tulis ulang tasks.json
      ↓
Response task terbaru -> TaskList meng-update state lokal (tanpa reload)
```

### c. Tambah / Edit tugas

```
User isi TaskForm -> submit
      ↓
onSubmit (didefinisikan di app/tasks/new/page.js atau app/tasks/[id]/page.js)
      ↓
axios POST /api/tasks   (tambah)   atau   axios PUT /api/tasks/:id  (edit)
      ↓
Route Handler menyimpan ke data/tasks.json
      ↓
router.push("/") + router.refresh() -> kembali ke daftar tugas, dan
memaksa Server Component (SSR) mengambil data terbaru
```

**Intinya:** halaman daftar (SSR) menyentuh data lewat `lib/tasks.js`
secara langsung di server saat pertama render, sedangkan semua interaksi
sesudahnya (filter/tambah/edit/hapus) lewat siklus
`komponen client → axios → API route → lib/tasks.js → file JSON → response
→ setState`.

---

## 4. Tantangan Umum & Solusi

| Tantangan | Kenapa terjadi | Solusi yang dipakai di proyek ini |
|---|---|---|
| **Server Component vs Client Component membingungkan** | App Router membedakan komponen server (default) dan client (`"use client"`); komponen server tidak boleh pakai `useState`/`onClick` | `app/page.js` dibuat Server Component (murni fetch data), sedangkan semua bagian interaktif dipisah ke komponen client (`TaskList`, `TaskItem`, `TaskForm`) yang diberi `"use client"` di baris pertama |
| **Data tidak sinkron setelah tambah/edit/hapus** | Halaman list di-SSR sekali saat load, sedangkan aksi CRUD terjadi di client — kalau tidak ditangani, data lama tetap tampil setelah `router.push` | Panggil `router.refresh()` setelah aksi create/update di halaman terpisah supaya Server Component re-fetch data terbaru; untuk aksi di halaman list sendiri (toggle/hapus), state di-update langsung lewat `setTasks` agar tidak perlu refresh |
| **Race condition saat fetch di `useEffect` (dynamic route)** | Kalau user cepat berpindah id (mis. lewat back/forward), response fetch lama bisa "menimpa" state setelah komponen sudah pindah konteks | Pakai flag `ignore` di cleanup function `useEffect` (lihat `app/tasks/[id]/page.js`) supaya `setState` tidak dipanggil setelah efek "dibatalkan" |
| **Penyimpanan file JSON tidak cocok untuk production/serverless** | Vercel & platform serverless lain punya filesystem read-only saat production, jadi tulisan ke file tidak persisten antar-request | Untuk tugas kuliah/local dev ini cukup; untuk produksi, cukup ganti isi `lib/tasks.js` dengan query database — struktur fungsi (`getAllTasks`, `createTask`, dst.) sengaja dibuat seperti repository pattern supaya gampang di-swap tanpa mengubah kode di komponen/route |
| **Duplikasi kode form untuk "Tambah" dan "Edit"** | Kalau dibuat dua form terpisah, perubahan struktur input harus diulang dua kali | Satu komponen `TaskForm` reusable, mode ditentukan lewat props `initialData` (ada/tidaknya) dan logic simpan diserahkan ke parent lewat `onSubmit` |
| **Params dinamis (`[id]`) dan validasi input** | ID tidak ditemukan / input kosong bisa membuat aplikasi crash | Route handler mengecek `if (!task)` dan mengembalikan status 404 dengan pesan jelas; `TaskForm` memvalidasi judul tidak boleh kosong sebelum submit |

---

## 5. Langkah Kerja (untuk dokumentasi laporan)

Urutan ini bisa dipakai sebagai daftar langkah pengerjaan di laporan:

1. **Inisialisasi proyek** — setup Next.js (App Router) + Tailwind CSS + axios.
2. **Rancang model data** — tentukan struktur objek tugas (`id`, `title`,
   `description`, `status`, `createdAt`) dan buat `data/tasks.json` sebagai
   data awal.
3. **Buat layer akses data (`lib/tasks.js`)** — fungsi CRUD dasar yang
   membaca/menulis file JSON, dipakai bersama oleh API routes dan halaman SSR.
4. **Buat API routes (`app/api/tasks/**`)** — implementasi endpoint
   GET/POST/PUT/DELETE menggunakan Route Handlers.
5. **Setup axios (`lib/axios.js`)** — instance terpusat untuk memanggil
   API routes dari client.
6. **Bangun komponen reusable** — `TaskItem`, `TaskForm`, `FilterBar`,
   `StatusBadge`, masing-masing menerima data lewat props.
7. **Bangun halaman daftar tugas dengan SSR** — `app/page.js` sebagai
   Server Component yang mengambil data langsung dari `lib/tasks.js`
   (`export const dynamic = "force-dynamic"` untuk memastikan render
   ulang di server setiap request).
8. **Bangun state management di client** — `TaskList` memakai
   `useState` (menyimpan daftar tugas & filter aktif) dan `useEffect`
   (memicu fetch ulang saat filter berubah).
9. **Bangun halaman tambah & edit** — routing dinamis
   (`app/tasks/new`, `app/tasks/[id]`), memakai `TaskForm` yang sama.
10. **Uji end-to-end** — tambah tugas, filter status, tandai selesai,
    edit, hapus, pastikan data konsisten antara SSR awal dan interaksi
    client.
11. **Styling akhir** — rapikan tampilan dengan Tailwind (spacing, warna
    status, responsivitas dasar).
