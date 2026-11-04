"use client";

import React from "react";
import { Wifi, BatteryMedium } from "lucide-react";

interface PhoneMockupFrameProps {
  children: React.ReactNode;
  className?: string;
}

export function PhoneMockupFrame({ children, className = "" }: PhoneMockupFrameProps) {
  return (
    <div
      className={`relative mx-auto transition-transform duration-500 hover:-translate-y-1 ${className}`}
      style={{
        maxWidth: "340px",
        filter: "drop-shadow(0 25px 35px rgba(180, 83, 9, 0.18)) drop-shadow(0 10px 15px rgba(0, 0, 0, 0.08))",
      }}
    >
      {/* Outer Titanium Phone Chassis */}
      <div className="relative rounded-[48px] p-[10px] bg-gradient-to-b from-stone-300 via-stone-400 to-stone-500 ring-1 ring-black/20 shadow-2xl">
        {/* Inner Black Bezel */}
        <div className="relative rounded-[40px] bg-black p-[2px] overflow-hidden">
          {/* Glass Screen Container */}
          <div className="relative rounded-[38px] bg-[#fcf9f2] overflow-hidden max-h-[680px] overflow-y-auto scrollbar-none flex flex-col">
            {/* Dynamic Island & Status Bar */}
            <div className="sticky top-0 z-40 flex items-center justify-between px-6 pt-3 pb-1 bg-[#fcf9f2]/95 backdrop-blur-sm border-b border-black/5">
              <span className="text-[11px] font-semibold tracking-tight text-stone-900">
                9:41
              </span>

              {/* Dynamic Island Capsule */}
              <div className="mx-auto h-5 w-24 rounded-full bg-black flex items-center justify-between px-2">
                <div className="h-2 w-2 rounded-full bg-stone-900/80 ring-1 ring-stone-800" />
                <div className="h-1.5 w-1.5 rounded-full bg-blue-950/60" />
              </div>

              {/* Status Icons */}
              <div className="flex items-center gap-1.5 text-stone-900">
                <Wifi className="h-3 w-3" strokeWidth={2} />
                <BatteryMedium className="h-3.5 w-3.5" strokeWidth={2} />
              </div>
            </div>

            {/* Screen Content (The Wedding Invitation Theme) */}
            <div className="flex-1 w-full relative">
              {children}
            </div>

            {/* Home Indicator Bar */}
            <div className="sticky bottom-0 z-40 w-full py-1.5 bg-[#fcf9f2]/80 backdrop-blur-xs flex justify-center pointer-events-none">
              <div className="h-1 w-28 rounded-full bg-stone-900/25" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
