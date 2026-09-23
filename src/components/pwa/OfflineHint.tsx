"use client";

import { useEffect, useState } from "react";
import styles from "./OfflineHint.module.css";

export function OfflineHint() {
  const [offline, setOffline] = useState(false);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);

    const dismissed = localStorage.getItem("handcal-pwa-hint") === "1";
    if (!dismissed && navigator.onLine) setShowInstall(true);

    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem("handcal-pwa-hint", "1");
    setShowInstall(false);
  };

  if (offline) {
    return (
      <div className={styles.banner} role="status">
        오프라인 모드 · 캐시된 레슨으로 학습 가능
      </div>
    );
  }

  if (!showInstall) return null;

  return (
    <div className={styles.hint} role="note">
      <p>
        비행기에서도 쓰려면: 브라우저 메뉴에서{" "}
        <strong>홈 화면에 추가</strong> / <strong>앱 설치</strong>를 한 뒤,
        주요 레슨을 한 번씩 열어 두세요.
      </p>
      <button type="button" onClick={dismiss} className={styles.btn}>
        알겠어요
      </button>
    </div>
  );
}
