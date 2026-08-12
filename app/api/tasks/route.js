import { NextResponse } from "next/server";
import { getAllTasks, createTask } from "@/lib/tasks";

// GET /api/tasks                         -> semua tugas
// GET /api/tasks?status=proses           -> filter berdasarkan status
// GET /api/tasks?priority=tinggi         -> filter berdasarkan prioritas
// GET /api/tasks?q=laporan               -> pencarian judul/deskripsi
// GET /api/tasks?sort=deadline           -> urutkan (terbaru|terlama|deadline|prioritas)
// Semua parameter bisa dikombinasikan.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const q = searchParams.get("q");
  const sort = searchParams.get("sort") || "terbaru";

  let tasks = getAllTasks({ sort });

  if (status && status !== "semua") {
    tasks = tasks.filter((t) => t.status === status);
  }

  if (priority && priority !== "semua") {
    tasks = tasks.filter((t) => t.priority === priority);
  }

  if (q && q.trim()) {
    const keyword = q.trim().toLowerCase();
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(keyword) ||
        (t.description || "").toLowerCase().includes(keyword)
    );
  }

  return NextResponse.json(tasks);
}

// POST /api/tasks -> buat tugas baru
export async function POST(request) {
  const body = await request.json();
  const { title, description, status, priority, dueDate } = body;

  if (!title || !title.trim()) {
    return NextResponse.json(
      { message: "Judul tugas wajib diisi." },
      { status: 400 }
    );
  }

  const newTask = createTask({ title, description, status, priority, dueDate });
  return NextResponse.json(newTask, { status: 201 });
}
