import BottomNav from "../components/BottomNav";
import BrandHeader from "../components/BrandHeader";
import InstallPrompt from "../components/InstallPrompt";
import { DraftProvider } from "../context/DraftContext";
import PhoneFrame from "./PhoneFrame";
import Screen from "./Screen";

/**
 * Shell for every signed-in screen: brand on top, scrolling content in the
 * middle, navigation pinned within thumb reach at the bottom.
 */
export default function AppLayout() {
  return (
    <PhoneFrame>
      <InstallPrompt />
      <BrandHeader />

      {/* Above the screens so a report in progress survives moving between them,
          and above the nav so signing out can tell whether one would be lost. */}
      <DraftProvider>
        <Screen />
        <BottomNav />
      </DraftProvider>
    </PhoneFrame>
  );
}
