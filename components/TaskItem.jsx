"use client";

// components/TaskItem.jsx
//
// Reusable component: menerima data satu tugas + beberapa callback lewat
// props (onToggleComplete, onDelete). Komponen ini tidak menyimpan state
// sendiri dan tidak tahu-menahu soal API — semua aksi didelegasikan ke
// parent (TaskList) lewat props. Ini memudahkan reuse & testing.
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";

function formatDueDate(dueDate) {
  return new Date(dueDate + "T00:00:00").toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function TaskItem({ task, onToggleComplete, onDelete }) {
  const isDone = task.status === "selesai";

  // Deteksi terlambat: punya deadline, sudah lewat hari ini, dan belum selesai.
  const today = new Date().toISOString().slice(0, 10);
  const isOverdue = task.dueDate && task.dueDate < today && !isDone;

  return (
    <li className="flex items-start justify-between gap-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-start gap-3 flex-1">
        <input
          type="checkbox"
          checked={isDone}
          onChange={() => onToggleComplete(task)}
          className="mt-1 h-4 w-4 accent-blue-600 cursor-pointer"
          title="Tandai selesai"
        />
        <div>
          <Link
            href={`/tasks/${task.id}`}
            className={`font-medium hover:underline ${
              isDone ? "line-through text-gray-400" : "text-gray-900"
            }`}
          >
            {task.title}
          </Link>
          {task.description && (
            <p className="text-sm text-gray-500 mt-0.5">{task.description}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={task.status} />
            {task.priority && <PriorityBadge priority={task.priority} />}
            {task.dueDate && (
              <span
                className={`text-xs font-medium ${
                  isOverdue ? "text-red-600" : "text-gray-500"
                }`}
              >
                ⏰ {formatDueDate(task.dueDate)}
                {isOverdue && " (terlambat)"}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 shrink-0">
        <Link
          href={`/tasks/${task.id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(task.id)}
          className="text-sm text-red-600 hover:underline"
        >
          Hapus
        </button>
      </div>
    </li>
  );
}
