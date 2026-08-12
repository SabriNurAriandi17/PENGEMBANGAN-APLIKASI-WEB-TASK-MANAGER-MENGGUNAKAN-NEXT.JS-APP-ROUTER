// components/StatusBadge.jsx
//
// Komponen kecil & reusable: menerima `status` lewat props, menentukan
// warna badge sendiri. Dipakai di TaskItem dan halaman detail.
const STATUS_STYLES = {
  belum: "bg-gray-200 text-gray-700",
  proses: "bg-yellow-100 text-yellow-800",
  selesai: "bg-green-100 text-green-800",
};

const STATUS_LABELS = {
  belum: "Belum Dikerjakan",
  proses: "Sedang Dikerjakan",
  selesai: "Selesai",
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.belum;
  const label = STATUS_LABELS[status] || status;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}
