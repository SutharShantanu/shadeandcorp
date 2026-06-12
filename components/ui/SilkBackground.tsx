"use client";

import dynamic from "next/dynamic";

const Silk = dynamic(() => import("@/components/ui/Silk"), { ssr: false });

export default function SilkBackground() {
  return (
    <div className="fixed inset-0 w-full h-full z-0">
      <Silk
        speed={2.5}
        scale={1}
        color="#b9b1e4"
        noiseIntensity={0.5}
        rotation={0}
      />
    </div>
  );
}
