"use client";

import React, { useState } from "react";
import {
  Zap,
  CreditCard,
  Smartphone,
  Landmark,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BadgePercent,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BankOffer } from "@/lib/constants";

const EMI_PLANS = [
  { months: 3, rate: 13, label: "3 months" },
  { months: 6, rate: 14, recommended: true, label: "6 months" },
  { months: 9, rate: 15, label: "9 months" },
  { months: 12, rate: 15, label: "12 months" },
  { months: 18, rate: 16, label: "18 months" },
  { months: 24, rate: 16, label: "24 months" },
];

const INITIAL_VISIBLE = 3;

function getOfferIcon(type: string) {
  switch (type) {
    case "upi":
      return <Smartphone className="w-4 h-4" />;
    case "netbanking":
      return <Landmark className="w-4 h-4" />;
    default:
      return <CreditCard className="w-4 h-4" />;
  }
}

function getOfferColor(type: string) {
  switch (type) {
    case "upi":
      return "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400";
    case "netbanking":
      return "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400";
    default:
      return "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400";
  }
}

function getOfferBadgeStyle(type: string) {
  switch (type) {
    case "upi":
      return "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800";
    case "netbanking":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800";
    default:
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800";
  }
}

export function EmiAndBankOffersCard({
  offers,
  price,
}: {
  offers: BankOffer[];
  price: number;
}) {
  const [showAllPlans, setShowAllPlans] = useState(false);

  const visiblePlans = showAllPlans
    ? EMI_PLANS
    : EMI_PLANS.slice(0, INITIAL_VISIBLE);

  return (
    <Accordion type="single" collapsible className="w-full overflow-hidden">
      <AccordionItem value="offers" className="border-0">
        <AccordionTrigger className="hover:no-underline data-[state=open]:rounded-b-none px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary shrink-0" />
            <span className="text-sm font-semibold text-foreground">
              EMI &amp; Pay Later Options
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-0 text-muted-foreground border">
          {/* ─── EMI SECTION ─── */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <p className="text-sm text-foreground font-semibold">
                  Easy Installments
                </p>
              </div>
              <span className="text-tiny font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                No Cost EMI available
              </span>
            </div>

            <div className="space-y-2">
              {visiblePlans.map((plan) => {
                const totalInterest = Math.round(
                  (price * plan.rate * plan.months) / (12 * 100)
                );
                const totalPayable = price + totalInterest;
                const monthly = Math.round(totalPayable / plan.months);

                return (
                  <div
                    key={plan.months}
                    className={`relative flex items-center justify-between p-3 rounded-xl border transition-all group ${
                      plan.recommended
                        ? "border-primary/40 bg-primary/[0.03] shadow-sm"
                        : "border-border/50 bg-background hover:border-border hover:shadow-sm"
                    }`}
                  >
                    {plan.recommended && (
                      <div className="absolute -top-2.5 left-3">
                        <Badge className="text-[9px] px-1.5 py-0 h-4 font-bold bg-primary text-primary-foreground shadow-sm">
                          POPULAR
                        </Badge>
                      </div>
                    )}

                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-foreground tabular-nums">
                          ₹{monthly}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                          /mo
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        for {plan.label}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-semibold text-foreground tabular-nums">
                        Total: ₹{totalPayable.toLocaleString()}
                      </span>
                      <span className="text-tiny text-muted-foreground tabular-nums">
                        Interest: ₹{totalInterest.toLocaleString()} @{" "}
                        {plan.rate}% p.a.
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {EMI_PLANS.length > INITIAL_VISIBLE && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 h-8 text-xs text-primary hover:text-primary/80 hover:bg-primary/5"
                onClick={() => setShowAllPlans(!showAllPlans)}
              >
                {showAllPlans ? (
                  <>
                    <ChevronUp className="w-3 h-3 mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 mr-1" />
                    View All {EMI_PLANS.length} Plans
                  </>
                )}
              </Button>
            )}
          </div>

          {/* ─── BANK OFFERS SECTION ─── */}
          {offers && offers.length > 0 && (
            <div className="border-t border-border/60">
              <div className="px-4 py-3">
                <div className="flex items-center gap-2 mb-3">
                  <BadgePercent className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Bank & Payment Offers
                  </span>
                </div>

                <div className="space-y-2">
                  {offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="flex items-start gap-3 p-3 rounded-xl border border-border/40 bg-background hover:border-border/80 hover:shadow-sm transition-all"
                    >
                      {/* Icon */}
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${getOfferColor(offer.type)}`}
                      >
                        {getOfferIcon(offer.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm text-foreground font-medium leading-snug">
                            {offer.description}
                          </p>
                          <span
                            className={`inline-flex items-center text-tiny font-bold px-1.5 py-0.5 rounded-md border shrink-0 ${getOfferBadgeStyle(offer.type)}`}
                          >
                            {offer.type === "upi"
                              ? `₹${offer.discount} OFF`
                              : `${offer.discount}% OFF`}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1.5">
                          {offer.minAmount && (
                            <span className="text-[11px] text-muted-foreground">
                              Min. ₹{offer.minAmount.toLocaleString()}
                            </span>
                          )}
                          {offer.minAmount && (
                            <span className="text-muted-foreground/40">•</span>
                          )}
                          <span className="text-[11px] text-primary font-semibold cursor-pointer hover:underline">
                            T&amp;C Apply
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
