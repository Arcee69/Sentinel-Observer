import type { ReactNode } from "react";

/**
 * Constrains the app to a handset column and, on anything wider than a phone,
 * renders it as a device against the console backdrop. On a phone it is
 * edge-to-edge and exactly one screen tall, so the header and navigation stay
 * put while the content between them scrolls.
 */
export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh w-full justify-center frame:bg-console frame:p-6">
      <div
        className={
          "relative flex h-full w-full max-w-107 flex-col overflow-hidden bg-background text-foreground " +
          "frame:rounded-[22px] frame:shadow-[0_25px_70px_rgba(0,0,0,0.27)] frame:ring-1 frame:ring-white/8"
        }
      >
        {children}
      </div>
    </div>
  );
}
