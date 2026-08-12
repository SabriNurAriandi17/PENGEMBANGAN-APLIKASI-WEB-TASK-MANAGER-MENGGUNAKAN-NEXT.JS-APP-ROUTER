import { getAllTasks } from "@/lib/tasks";
import TaskList from "@/components/TaskList";

// =====================================================================
// SERVER-SIDE RENDERING (SSR) — App Router
// =====================================================================
// `app/page.js` adalah SERVER COMPONENT (tidak ada "use client" di atas).
// Secara default, Server Component di-render di server setiap kali ada
// request — mirip konsep SSR di Pages Router (getServerSideProps), hanya
// caranya berbeda: di sini kita langsung `await` fungsi pengambil data
// (`getAllTasks`) di dalam komponennya sendiri, tanpa perlu fungsi
// terpisah seperti getServerSideProps.
//
// `export const dynamic = "force-dynamic"` di bawah ini membuat perilaku
// SSR eksplisit: Next.js TIDAK akan meng-cache hasil render halaman ini,
// jadi setiap request akan membaca ulang data/tasks.json dari server —
// cocok untuk halaman daftar tugas yang datanya sering berubah (tambah,
// edit, hapus, tandai selesai).
//
// Data hasil SSR (`tasks`) dikirim sebagai props awal (`initialTasks`) ke
// TaskList (Client Component), supaya tampilan pertama sudah terisi tanpa
// loading, sementara interaksi selanjutnya (filter, toggle, hapus) tetap
// ditangani di client lewat axios + useState/useEffect.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const tasks = await getAllTasks();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Daftar Tugas</h1>
        <p className="text-sm text-gray-500 mt-1">
          Halaman ini di-render di server (SSR) setiap kali dibuka.
        </p>
      </div>

      <TaskList initialTasks={tasks} />
    </div>
  );
}
