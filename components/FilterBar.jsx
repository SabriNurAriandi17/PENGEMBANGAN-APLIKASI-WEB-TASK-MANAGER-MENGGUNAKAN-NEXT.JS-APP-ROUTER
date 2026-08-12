"use client";

// components/FilterBar.jsx
//
// Reusable: daftar opsi filter + status aktif dikirim lewat props,
// perubahan filter dikabarkan ke parent lewat onChange. Komponen ini
// tidak menyimpan state sendiri (controlled component).
const FILTERS = [
  { value: "semua", label: "Semua" },
  { value: "belum", label: "Belum Dikerjakan" },
  { value: "proses", label: "Sedang Dikerjakan" },
  { value: "selesai", label: "Selesai" },
];

export default function FilterBar({ activeFilter, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
            activeFilter === f.value
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
