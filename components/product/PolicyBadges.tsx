"use client";

import React from "react";
import { Truck, RefreshCcw, ShieldCheck, Package } from "lucide-react";

export function PolicyBadges() {
  const items = [
    { icon: Truck, label: "Free Shipping", sub: "orders > $50" },
    { icon: RefreshCcw, label: "30-Day Returns", sub: "hassle-free" },
    { icon: ShieldCheck, label: "1 Year Warranty", sub: "manufacturer" },
    { icon: Package, label: "Secure Packaging", sub: "damage-free" },
  ];
  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map(({ icon: Icon, label, sub }) => (
        <div
          key={label}
          className="flex flex-col items-center text-center gap-1 py-3 px-1 rounded-xl border border-border bg-muted/20"
        >
          <Icon className="w-5 h-5 text-primary" />
          <span className="text-xs font-semibold leading-tight">{label}</span>
          <span className="text-xs text-muted-foreground">{sub}</span>
        </div>
      ))}
    </div>
  );
}
