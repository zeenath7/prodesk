"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Quick auto-dismiss on mount
    const timer = window.setTimeout(() => {
      setVisible(false);
      document.body.classList.remove("is-loading");
    }, 450);

    return () => {
      window.clearTimeout(timer);
      document.body.classList.remove("is-loading");
    };
  }, []);

  useEffect(() => {
    if (visible) {
      document.body.classList.add("is-loading");
    } else {
      document.body.classList.remove("is-loading");
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="preloader transition-opacity duration-300"
      role="status"
      aria-live="polite"
      aria-label="Loading ProDesk"
    >
      <div className="preloader__content">
        <div className="preloader__logo-wrap">
          <Image
            src="/logo.png"
            alt="ProDesk"
            width={240}
            height={200}
            priority
            className="preloader__logo"
          />
        </div>
        <p className="preloader__label">Preparing your workspace</p>
        <div className="preloader__track" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}
