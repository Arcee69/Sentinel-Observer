/**
 * Shown at the top of every screen while the app is a preview, so nobody
 * mistakes a demo report for one that reached the Sentinel team.
 */
export default function PreviewBanner() {
  return (
    <p className="mb-3.5 rounded-lg border border-notice-border bg-notice px-2 py-1.5 text-[9px] leading-[1.6] text-notice-foreground">
      Preview only · No accounts or reports are submitted.
    </p>
  );
}
