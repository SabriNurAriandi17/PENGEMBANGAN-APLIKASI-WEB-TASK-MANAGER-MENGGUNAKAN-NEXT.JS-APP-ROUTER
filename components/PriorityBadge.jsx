// components/PriorityBadge.jsx
//
// Reusable component: menerima `priority` lewat props dan menentukan
// warna badge-nya sendiri. Sama polanya dengan StatusBadge — komponen
// presentational murni tanpa state (mudah di-reuse & diuji).
const PRIORITY_STYLES = {
  tinggi: "bg-red-100 text-red-700",
  sedang: "bg-blue-100 text-blue-700",
  rendah: "bg-gray-100 text-gray-600",
};

const PRIORITY_LABELS = {
  tinggi: "Prioritas Tinggi",
  sedang: "Prioritas Sedang",
  rendah: "Prioritas Rendah",
};

export default function PriorityBadge({ priority }) {
  const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.sedang;
  const label = PRIORITY_LABELS[priority] || priority;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}
