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
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import TaskItem from "./TaskItem";
import FilterBar from "./FilterBar";

export default function TaskList({ initialTasks }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState("semua");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    // Lewati fetch pertama karena data awal sudah didapat dari SSR
    // (dikirim lewat props `initialTasks`). Fetch hanya dijalankan saat
    // filter benar-benar berubah setelah render pertama.
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    fetchTasks(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function fetchTasks(status) {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/tasks", { params: { status } });
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
      <FilterBar activeFilter={filter} onChange={setFilter} />

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
