"use client";
import { useEffect } from "react";

export default function PWAInit() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("serviceWorker" in navigator) {
      const register = async () => {
        try {
          await navigator.serviceWorker.register("/sw.js");
          // console.log('[v0] Service worker registered')
        } catch (e) {
          console.log("[v0] SW registration failed", e);
        }
      };
      if (document.readyState === "complete") register();
      else window.addEventListener("load", register);
    }
  }, []);
  return null;
}
