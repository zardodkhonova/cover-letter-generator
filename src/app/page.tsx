import { WizardApp } from "@/components/WizardApp";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#05060a] text-sm text-white/40">
          Loading...
        </div>
      }
    >
      <WizardApp />
    </Suspense>
  );
}
