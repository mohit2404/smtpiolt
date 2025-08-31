"use client";
import { useState, useEffect } from "react";

export default function IOSInstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(userAgent) && !(typeof (window as any).MSStream !== "undefined");
    setIsIOS(iOS);

    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(standalone);
  }, []);

  // If not iOS or app already installed, don’t show prompt
  if (!isIOS || isStandalone) return null;

  return (
    <div
      style={{ padding: "1em", backgroundColor: "#eee", borderRadius: "8px" }}
    >
      <h3>Install this app on your iPhone</h3>
      <p>
        To install, tap the <strong>Share</strong> button&nbsp;
        <span role="img" aria-label="share icon">
          ⎋
        </span>
        &nbsp;below and then select <strong>Add to Home Screen</strong> &nbsp;
        <span role="img" aria-label="plus icon">
          ➕
        </span>
      </p>
    </div>
  );
}
