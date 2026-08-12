"use client";

// components/TaskForm.jsx
//
// Reusable form: dipakai di halaman "Tambah Tugas" maupun "Edit Tugas".
// Perbedaan mode ditentukan lewat props `initialData` (kalau ada -> mode
// edit) dan `submitLabel`. Logika submit (POST vs PUT, redirect ke mana)
// sepenuhnya diserahkan ke parent lewat callback `onSubmit`, supaya
// komponen ini tetap generic dan tidak terikat pada satu use case.
import { useState } from "react";

export default function TaskForm({ initialData, onSubmit, submitLabel = "Simpan" }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [status, setStatus] = useState(initialData?.status || "belum");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Judul tugas wajib diisi.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ title, description, status });
    } catch (err) {
      setError("Gagal menyimpan tugas. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Judul Tugas
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Contoh: Kerjakan laporan mingguan"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm min-h-[90px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Detail tambahan (opsional)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="belum">Belum Dikerjakan</option>
          <option value="proses">Sedang Dikerjakan</option>
          <option value="selesai">Selesai</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Menyimpan..." : submitLabel}
      </button>
    </form>
  );
}
