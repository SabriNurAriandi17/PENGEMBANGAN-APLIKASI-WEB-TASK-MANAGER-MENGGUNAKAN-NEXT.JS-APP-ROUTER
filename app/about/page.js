import Link from "next/link";

// =====================================================================
// STATIC SITE GENERATION (SSG) — App Router
// =====================================================================
// Berbeda dengan halaman daftar tugas (SSR, `force-dynamic`), halaman
// ini memakai `force-static`: di-render SATU KALI saat `next build`,
// lalu hasil HTML statisnya disajikan untuk semua request — sangat cepat
// karena tidak ada komputasi server per request. Cocok untuk konten yang
// jarang berubah seperti halaman "Tentang" ini.
//
// `revalidate = 3600` (ISR / Incremental Static Regeneration) membuat
// halaman statis ini diregenerasi paling cepat tiap 1 jam di background,
// jadi tetap bisa diperbarui tanpa build ulang manual.
export const dynamic = "force-static";
export const revalidate = 3600;

export const metadata = {
  title: "Tentang | Task Manager",
  description: "Tentang aplikasi Task Manager dan teknologi yang digunakan.",
};

const TECH_STACK = [
  {
    name: "Next.js (App Router)",
    desc: "Framework fullstack React: SSR, SSG/ISR, dan API Routes dalam satu proyek.",
  },
  {
    name: "React Hooks",
    desc: "useState, useEffect, dan useMemo untuk manajemen state, lifecycle, dan optimasi.",
  },
  {
    name: "Axios",
    desc: "HTTP client untuk integrasi RESTful API (GET, POST, PUT, DELETE).",
  },
  {
    name: "Tailwind CSS",
    desc: "Utility-first CSS untuk tampilan responsif dan konsisten.",
  },
];

const FEATURES = [
  "CRUD tugas lengkap (buat, baca, ubah, hapus) via RESTful API",
  "Filter status, filter prioritas, dan pengurutan (terbaru, deadline, prioritas)",
  "Pencarian tugas dengan debounce untuk mengurangi request API",
  "Prioritas dan deadline dengan indikator terlambat",
  "Panel statistik dan progress bar (dioptimasi dengan useMemo)",
  "SSR untuk halaman daftar, SSG/ISR untuk halaman ini, client-side fetching untuk detail",
];

export default function AboutPage() {
  // buildTime dievaluasi saat build (SSG) — bukti halaman ini statis:
  // nilainya tidak berubah antar-request sampai halaman diregenerasi.
  const buildTime = new Date().toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          &larr; Kembali ke daftar tugas
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          Tentang Aplikasi
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Halaman ini di-render secara statis (SSG) saat build. Waktu render:{" "}
          {buildTime}
        </p>
      </div>

      <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-3">
        <h2 className="font-semibold text-gray-900">Teknologi yang Digunakan</h2>
        <ul className="space-y-2">
          {TECH_STACK.map((tech) => (
            <li key={tech.name} className="text-sm">
              <span className="font-medium text-gray-900">{tech.name}</span>
              <span className="text-gray-500"> — {tech.desc}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-3">
        <h2 className="font-semibold text-gray-900">Fitur Aplikasi</h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          {FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
