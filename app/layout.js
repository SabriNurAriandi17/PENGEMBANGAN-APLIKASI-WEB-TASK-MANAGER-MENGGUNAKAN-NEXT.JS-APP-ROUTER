import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Task Manager",
  description: "Aplikasi Task Manager sederhana dengan Next.js App Router",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-semibold text-gray-900">
              📋 Task Manager
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/about"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Tentang
              </Link>
              <Link
                href="/tasks/new"
                className="bg-blue-600 text-white text-sm font-medium px-3 py-1.5 rounded-md hover:bg-blue-700"
              >
                + Tugas Baru
              </Link>
            </div>
          </div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
