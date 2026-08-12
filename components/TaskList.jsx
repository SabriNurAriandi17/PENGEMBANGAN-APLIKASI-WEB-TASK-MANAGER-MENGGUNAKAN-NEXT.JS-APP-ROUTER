"use client";

// components/TaskList.jsx
//
// Client Component yang memegang STATE utama daftar tugas.
//
// Alur data:
// 1. `initialTasks` diterima sebagai props dari Server Component
//    (app/page.js) — ini adalah hasil SSR, jadi saat halaman pertama kali
//    dibuka, daftar tugas SUDAH ada di HTML tanpa perlu menunggu fetch di
//    client (bagus untuk SEO & loading awal).
// 2. `initialTasks` dipakai sebagai nilai awal useState.
// 3. Setiap kali user mengganti filter, useEffect memanggil API route
//    lewat axios (`GET /api/tasks?status=...`) untuk mengambil data
//    terbaru sesuai filter, lalu meng-update state.
// 4. Aksi toggle selesai / hapus juga memanggil API route lewat axios,
//    lalu meng-update state secara lokal supaya UI langsung berubah tanpa
//    perlu reload halaman.
// 5. Fitur tambahan: pencarian dengan DEBOUNCE (useEffect + setTimeout),
//    filter prioritas, pengurutan (sort), dan panel statistik (TaskStats).
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import TaskItem from "./TaskItem";
import FilterBar from "./FilterBar";
import TaskStats from "./TaskStats";

const SORT_OPTIONS = [
  { value: "terbaru", label: "Terbaru" },
  { value: "terlama", label: "Terlama" },
  { value: "deadline", label: "Deadline Terdekat" },
  { value: "prioritas", label: "Prioritas Tertinggi" },
];

const PRIORITY_OPTIONS = [
  { value: "semua", label: "Semua Prioritas" },
  { value: "tinggi", label: "Tinggi" },
  { value: "sedang", label: "Sedang" },
  { value: "rendah", label: "Rendah" },
];

export default function TaskList({ initialTasks }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState("semua");
  const [priority, setPriority] = useState("semua");
  const [sort, setSort] = useState("terbaru");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFirstRender, setIsFirstRender] = useState(true);

  // DEBOUNCE pencarian: tunda 400ms setelah user berhenti mengetik,
  // baru update `debouncedSearch` yang memicu fetch. Cleanup function
  // useEffect membatalkan timer lama setiap kali `search` berubah —
  // teknik optimasi supaya tidak memanggil API di setiap ketikan.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    // Lewati fetch pertama karena data awal sudah didapat dari SSR
    // (dikirim lewat props `initialTasks`). Fetch hanya dijalankan saat
    // filter/sort/pencarian benar-benar berubah setelah render pertama.
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, priority, sort, debouncedSearch]);

  async function fetchTasks() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/tasks", {
        params: {
          status: filter,
          priority,
          sort,
          q: debouncedSearch,
        },
      });
      setTasks(res.data);
    } catch (err) {
      setError("Gagal memuat daftar tugas.");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleComplete(task) {
    const newStatus = task.status === "selesai" ? "belum" : "selesai";
    try {
      const res = await api.put(`/tasks/${task.id}`, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? res.data : t))
      );
    } catch (err) {
      setError("Gagal mengubah status tugas.");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Hapus tugas ini?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError("Gagal menghapus tugas.");
    }
  }

  return (
    <div className="space-y-4">
      <TaskStats tasks={tasks} />

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cari tugas (judul / deskripsi)..."
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex flex-wrap items-center gap-3">
        <FilterBar activeFilter={filter} onChange={setFilter} />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Filter prioritas"
        >
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Urutkan"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Urut: {opt.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-gray-500">Memuat...</p>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-gray-500">Tidak ada tugas untuk filter ini.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
