"use client";

// app/tasks/new/page.js
//
// Halaman tambah tugas. Client Component karena butuh interaktivitas
// (form, navigasi setelah submit). Memakai komponen reusable TaskForm,
// logic penyimpanan (POST ke API route) didefinisikan di sini lewat
// callback onSubmit.
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import TaskForm from "@/components/TaskForm";

export default function NewTaskPage() {
  const router = useRouter();

  async function handleCreate(data) {
    await api.post("/tasks", data);
    router.push("/");
    router.refresh(); // memastikan halaman list (SSR) mengambil data terbaru
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          &larr; Kembali ke daftar tugas
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          Tambah Tugas Baru
        </h1>
      </div>

      <TaskForm onSubmit={handleCreate} submitLabel="Tambah Tugas" />
    </div>
  );
}
