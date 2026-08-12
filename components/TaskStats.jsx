"use client";

// components/TaskStats.jsx
//
// Panel statistik ringkas: total tugas, jumlah per status, jumlah yang
// terlambat (melewati deadline), dan progress bar persentase selesai.
//
// Menerima `tasks` lewat props dan MENGHITUNG statistiknya dengan
// useMemo — teknik optimasi performa React: kalkulasi hanya diulang
// ketika `tasks` berubah, bukan pada setiap render.
import { useMemo } from "react";

export default function TaskStats({ tasks }) {
  const stats = useMemo(() => {
    const total = tasks.length;
    const selesai = tasks.filter((t) => t.status === "selesai").length;
    const proses = tasks.filter((t) => t.status === "proses").length;
    const belum = tasks.filter((t) => t.status === "belum").length;

    const today = new Date().toISOString().slice(0, 10);
    const terlambat = tasks.filter(
      (t) => t.dueDate && t.dueDate < today && t.status !== "selesai"
    ).length;

    const persenSelesai = total > 0 ? Math.round((selesai / total) * 100) : 0;

    return { total, selesai, proses, belum, terlambat, persenSelesai };
  }, [tasks]);

  const items = [
    { label: "Total", value: stats.total, color: "text-gray-900" },
    { label: "Belum", value: stats.belum, color: "text-gray-600" },
    { label: "Proses", value: stats.proses, color: "text-yellow-600" },
    { label: "Selesai", value: stats.selesai, color: "text-green-600" },
    { label: "Terlambat", value: stats.terlambat, color: "text-red-600" },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3">
      <div className="grid grid-cols-5 gap-2 text-center">
        {items.map((item) => (
          <div key={item.label}>
            <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-xs text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{stats.persenSelesai}% selesai</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${stats.persenSelesai}%` }}
          />
        </div>
      </div>
    </div>
  );
}
