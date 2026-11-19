import { useEffect, useId, useRef, type ReactNode } from "react";
import Button from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  /** Also called for Escape and a tap outside the panel. */
  onCancel: () => void;
}

/**
 * Asks the observer to confirm an action before it happens.
 *
 * Built on the native `<dialog>`: opened with `showModal()`, it sits above the
 * page, keeps focus inside, closes on Escape and hands focus back to the
 * control that opened it. Focus starts on the cancel button, so an accidental
 * Enter keeps things as they are.
 */
export default function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const bodyId = useId();

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;

    if (open && !element.open) {
      element.showModal();
      cancel.current?.focus();
    } else if (!open && element.open) {
      element.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      onCancel={(event) => {
        // Escape: let React state decide, so `open` stays the source of truth.
        event.preventDefault();
        onCancel();
      }}
      onClick={(event) => {
        // The panel fills the dialog, so a click on the dialog itself is the backdrop.
        if (event.target === event.currentTarget) onCancel();
      }}
      className={
        "fixed inset-0 m-auto h-fit w-[calc(100%-2.5rem)] max-w-80 rounded-[14px] border border-border " +
        "bg-surface p-0 text-foreground shadow-[0_18px_50px_rgba(16,43,67,0.22)] " +
        "backdrop:bg-navy/45"
      }
    >
      <div className="px-4.5 pt-4.5 pb-4">
        <h2 id={titleId} className="text-[17px] leading-snug font-bold tracking-[-0.4px]">
          {title}
        </h2>
        <div id={bodyId} className="mt-1.5 text-xs leading-[1.65] text-muted-foreground">
          {children}
        </div>

        <Button onClick={onConfirm} className="mt-4">
          {confirmLabel}
        </Button>
        <Button ref={cancel} variant="secondary" onClick={onCancel} className="mt-2">
          {cancelLabel}
        </Button>
      </div>
    </dialog>
  );
}
