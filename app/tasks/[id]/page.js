"use client";

// app/tasks/[id]/page.js
//
// Halaman detail sekaligus edit tugas. Berbeda dari halaman list
// (SSR di server), halaman ini mengambil data di CLIENT lewat
// useEffect + axios, memakai `params.id` dari dynamic route.
// Dipilih pendekatan client-fetch di sini untuk mendemonstrasikan
// pola yang berbeda dari halaman list (variasi: SSR vs client-side
// fetching), sekaligus mempermudah pengelolaan state form.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import TaskForm from "@/components/TaskForm";

export default function TaskDetailPage({ params }) {
  const { id } = params;
  const router = useRouter();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function fetchTask() {
      setLoading(true);
      try {
        const res = await api.get(`/tasks/${id}`);
        if (!ignore) setTask(res.data);
      } catch (err) {
        if (!ignore) setNotFound(true);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchTask();
    return () => {
      ignore = true; // cegah update state kalau komponen sudah unmount
    };
  }, [id]);

  async function handleUpdate(data) {
    await api.put(`/tasks/${id}`, data);
    router.push("/");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Hapus tugas ini?")) return;
    await api.delete(`/tasks/${id}`);
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return <p className="text-sm text-gray-500">Memuat data tugas...</p>;
  }

  if (notFound || !task) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-600">Tugas tidak ditemukan.</p>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          &larr; Kembali ke daftar tugas
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            &larr; Kembali ke daftar tugas
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            Edit Tugas
          </h1>
        </div>
        <button
          onClick={handleDelete}
          className="text-sm text-red-600 hover:underline"
        >
          Hapus Tugas
        </button>
      </div>

      <TaskForm
        initialData={task}
        onSubmit={handleUpdate}
        submitLabel="Simpan Perubahan"
      />
    </div>
  );
}
