"use client";

import { useEffect, useState } from "react";
import styles from "./OfflineHint.module.css";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type PrecacheState = {
  done: number;
  total: number;
  finished?: boolean;
};

export function OfflineHint() {
  const [offline, setOffline] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [precache, setPrecache] = useState<PrecacheState | null>(null);

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);

    const ready = localStorage.getItem("handcal-offline-ready") === "1";
    const dismissed = localStorage.getItem("handcal-pwa-hint") === "1";
    if (!dismissed && navigator.onLine) setShowHint(true);
    if (ready) {
      setPrecache({ done: 1, total: 1, finished: true });
    }

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShowHint(true);
    };
    window.addEventListener("beforeinstallprompt", onBip);

    const onMsg = (event: MessageEvent) => {
      if (event.data?.type !== "handcal-precache") return;
      const next = {
        done: event.data.done as number,
        total: event.data.total as number,
        finished: Boolean(event.data.finished),
      };
      setPrecache(next);
      if (next.finished) {
        localStorage.setItem("handcal-offline-ready", "1");
      }
    };
    navigator.serviceWorker?.addEventListener("message", onMsg);

    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
      window.removeEventListener("beforeinstallprompt", onBip);
      navigator.serviceWorker?.removeEventListener("message", onMsg);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem("handcal-pwa-hint", "1");
    setShowHint(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    dismiss();
  };

  const downloadAll = async () => {
    const reg = await navigator.serviceWorker?.ready;
    reg?.active?.postMessage({ type: "handcal-precache-now" });
    setPrecache({ done: 0, total: 1, finished: false });
  };

  if (offline) {
    return (
      <div className={styles.banner} role="status">
        오프라인 모드 · 저장된 레슨으로 학습 가능
      </div>
    );
  }

  if (!showHint && !precache) return null;
  if (!showHint && precache?.finished) return null;

  const pct =
    precache && precache.total > 0
      ? Math.min(100, Math.round((precache.done / precache.total) * 100))
      : null;

  return (
    <div className={styles.hint} role="note">
      <p>
        {precache?.finished ? (
          <>
            <strong>전체 레슨 저장 완료.</strong> 비행기에서도 홈 화면 아이콘으로
            실행하면 됩니다.
          </>
        ) : pct != null && !precache?.finished ? (
          <>
            오프라인용으로 <strong>전체 받는 중… {pct}%</strong>
          </>
        ) : deferred ? (
          <>
            와이파이에서 <strong>한 번만</strong> 열어 두면 레슨 전체가
            받아집니다. 원하면 앱으로도 설치하세요.
          </>
        ) : (
          <>
            와이파이에서 이 사이트만 열어 두면 <strong>레슨 전체가 자동으로</strong>{" "}
            받아집니다. 그다음 홈 화면에 추가해 두세요.
          </>
        )}
      </p>
      <div className={styles.actions}>
        {!precache?.finished && (
          <button type="button" onClick={downloadAll} className={styles.install}>
            지금 전체 받기
          </button>
        )}
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
