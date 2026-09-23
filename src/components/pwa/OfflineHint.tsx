"use client";

import { useEffect, useState } from "react";
import styles from "./OfflineHint.module.css";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function OfflineHint() {
  const [offline, setOffline] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);

    const dismissed = localStorage.getItem("handcal-pwa-hint") === "1";
    if (!dismissed && navigator.onLine) setShowInstall(true);

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", onBip);

    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
      window.removeEventListener("beforeinstallprompt", onBip);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem("handcal-pwa-hint", "1");
    setShowInstall(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    dismiss();
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
        {deferred ? (
          <>
            비행기·오프라인에서도 쓰려면 <strong>앱으로 설치</strong>하세요.
          </>
        ) : (
          <>
            비행기에서도 쓰려면 브라우저 메뉴에서{" "}
            <strong>홈 화면에 추가</strong> 후, 레슨을 한 번씩 열어 두세요.
          </>
        )}
      </p>
      <div className={styles.actions}>
        {deferred && (
          <button type="button" onClick={install} className={styles.install}>
            설치
          </button>
        )}
        <button type="button" onClick={dismiss} className={styles.btn}>
          알겠어요
        </button>
      </div>
    </div>
  );
}
