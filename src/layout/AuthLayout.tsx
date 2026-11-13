import BrandHeader from "../components/BrandHeader";
import PhoneFrame from "./PhoneFrame";
import Screen from "./Screen";

/** Wrapper for sign-up, sign-in and password recovery. */
export default function AuthLayout() {
  return (
    <PhoneFrame>
      <BrandHeader />
      <Screen
        footer={
          <footer className="px-4 pt-2.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] text-center font-mono text-[7px] leading-[1.6] tracking-[1.4px] text-faint">
            OBSERVE RESPONSIBLY · REPORT FACTUALLY
          </footer>
        }
      />
    </PhoneFrame>
  );
}
