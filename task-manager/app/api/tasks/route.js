import { NextResponse } from "next/server";
import { getAllTasks, createTask } from "@/lib/tasks";

// GET /api/tasks              -> semua tugas
// GET /api/tasks?status=proses -> filter berdasarkan status
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let tasks = getAllTasks();

  if (status && status !== "semua") {
    tasks = tasks.filter((t) => t.status === status);
  }

  return NextResponse.json(tasks);
}

// POST /api/tasks -> buat tugas baru
export async function POST(request) {
  const body = await request.json();
  const { title, description, status } = body;

  if (!title || !title.trim()) {
    return NextResponse.json(
      { message: "Judul tugas wajib diisi." },
      { status: 400 }
    );
  }

  const newTask = createTask({ title, description, status });
  return NextResponse.json(newTask, { status: 201 });
}
