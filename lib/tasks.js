// lib/tasks.js
//
// Layer akses data ("database" sederhana) berbasis file JSON.
// Dipakai oleh:
//  - API routes (app/api/tasks/**) untuk operasi CRUD dari client (via axios)
//  - app/page.js (Server Component) untuk mengambil data langsung saat SSR,
//    tanpa perlu memanggil API route sendiri lewat HTTP.
//
// CATATAN: file ini HANYA boleh dipakai di sisi server (route handler /
// server component), karena memakai modul Node.js `fs`. Jangan diimpor
// dari client component.
//
// CATATAN PRODUKSI: penyimpanan file JSON tidak persisten di platform
// serverless (mis. Vercel) karena filesystem read-only saat production.
// Untuk produksi sungguhan, ganti isi fungsi-fungsi di bawah ini dengan
// query ke database (PostgreSQL/MongoDB/SQLite+Prisma dll). Nama & bentuk
// fungsi sengaja dibuat seperti repository pattern supaya mudah diganti
// tanpa mengubah kode di route handler.

import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "tasks.json");

function readTasks() {
  const raw = fs.readFileSync(dataFilePath, "utf-8");
  return JSON.parse(raw);
}

function writeTasks(tasks) {
  fs.writeFileSync(dataFilePath, JSON.stringify(tasks, null, 2), "utf-8");
}

const PRIORITY_ORDER = { tinggi: 0, sedang: 1, rendah: 2 };

// getAllTasks menerima opsi { sort } supaya urutan bisa dikontrol dari
// query string API (?sort=deadline / ?sort=prioritas / ?sort=terlama).
export function getAllTasks({ sort = "terbaru" } = {}) {
  const tasks = readTasks();

  switch (sort) {
    case "terlama":
      return tasks.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    case "deadline":
      // Tugas dengan deadline terdekat dulu; yang tanpa deadline di akhir.
      return tasks.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    case "prioritas":
      return tasks.sort(
        (a, b) =>
          (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1)
      );
    case "terbaru":
    default:
      return tasks.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
  }
}

export function getTaskById(id) {
  const tasks = readTasks();
  return tasks.find((t) => t.id === id) || null;
}

export function createTask({ title, description, status, priority, dueDate }) {
  const tasks = readTasks();
  const newTask = {
    id: Date.now().toString(),
    title,
    description: description || "",
    status: status || "belum",
    priority: priority || "sedang",
    dueDate: dueDate || null, // format "YYYY-MM-DD" atau null
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  writeTasks(tasks);
  return newTask;
}

export function updateTask(id, updates) {
  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  tasks[index] = { ...tasks[index], ...updates };
  writeTasks(tasks);
  return tasks[index];
}

export function deleteTask(id) {
  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;

  tasks.splice(index, 1);
  writeTasks(tasks);
  return true;
}
