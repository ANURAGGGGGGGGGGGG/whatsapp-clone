"use client";

import { ToastContainer } from "react-toastify";

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2500}
      closeOnClick
      pauseOnHover
      draggable
      theme="dark"
    />
  );
}
