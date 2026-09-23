"use client";

import { useEffect } from "react";

/** Registers the offline service worker (airplane-mode friendly after first visit). */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const swUrl = `${base}/sw.js`;

    navigator.serviceWorker.register(swUrl).catch((err) => {
      console.warn("SW register failed", err);
    });
  }, []);

  return null;
}
