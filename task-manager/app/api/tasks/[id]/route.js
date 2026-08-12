import { NextResponse } from "next/server";
import { getTaskById, updateTask, deleteTask } from "@/lib/tasks";

// GET /api/tasks/:id -> detail satu tugas
export async function GET(request, { params }) {
  const task = getTaskById(params.id);

  if (!task) {
    return NextResponse.json(
      { message: "Tugas tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json(task);
}

// PUT /api/tasks/:id -> update tugas (edit / tandai selesai)
export async function PUT(request, { params }) {
  const body = await request.json();
  const updated = updateTask(params.id, body);

  if (!updated) {
    return NextResponse.json(
      { message: "Tugas tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}

// DELETE /api/tasks/:id -> hapus tugas
export async function DELETE(request, { params }) {
  const success = deleteTask(params.id);

  if (!success) {
    return NextResponse.json(
      { message: "Tugas tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Tugas berhasil dihapus." });
}
