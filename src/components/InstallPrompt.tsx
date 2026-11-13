import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { STORAGE_KEYS } from "../lib/constants";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function wasDismissed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.installDismissed) === "true";
  } catch {
    return false;
  }
}

/**
 * Nudge to install the PWA. Installing gets the observer a home-screen icon
 * and an app that still opens where the signal doesn't reach.
 */
export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(wasDismissed);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setDeferred(null);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!deferred || dismissed) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.installDismissed, "true");
    } catch {
      /* storage blocked — it will simply ask again next visit */
    }
    setDismissed(true);
  };

  const install = async () => {
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  return (
    <div className="flex shrink-0 items-center gap-2.5 border-b border-notice-border bg-primary-soft px-4 py-2">
      <Download className="size-4 shrink-0 text-primary" strokeWidth={1.7} aria-hidden />
      <p className="flex-1 text-[11px] leading-snug text-foreground">
        <span className="font-semibold">Install Sentinel Observer</span> to open it from your
        home screen, even offline.
      </p>
      <button
        type="button"
        onClick={() => void install()}
        className="shrink-0 rounded-lg bg-primary px-2.5 py-1.5 text-[11px] font-bold text-primary-foreground"
      >
        Install
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss install prompt"
        className="grid size-7 shrink-0 place-items-center text-subtle"
      >
        <X className="size-4" aria-hidden />
      </button>
    </div>
  );
}
