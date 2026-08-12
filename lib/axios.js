// lib/axios.js
//
// Instance axios terpusat supaya base config (baseURL, header) tidak
// diulang-ulang di setiap komponen yang memanggil API routes.
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

export default api;
