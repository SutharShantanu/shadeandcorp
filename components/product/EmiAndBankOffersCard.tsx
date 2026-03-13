"use client";

import React from "react";
import { Zap, Home, Banknote } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { BankOffer } from "@/lib/constants";

export function EmiAndBankOffersCard({
  offers,
  price,
}: {
  offers: BankOffer[];
  price: number;
}) {
  const emiPlans = [
    { months: 3, rate: 16 },
    { months: 6, rate: 16 },
    { months: 9, rate: 16 },
    { months: 12, rate: 16 },
    { months: 18, rate: 16 },
    { months: 24, rate: 16 },
  ];

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
        <AccordionContent className="p-0 text-muted-foreground border ">
          {/* EMI SECTION */}
          <div className="p-4 bg-muted/10 border-b border-border/60">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-foreground font-semibold">
                Easy Installments
              </p>
              <Badge
                variant="outline"
                className="text-[10px] font-bold tracking-wider text-muted-foreground"
              >
                16% P.A.
              </Badge>
            </div>
            <div className="space-y-3">
              {emiPlans.map((plan) => {
                const interest = (price * plan.rate) / 100;
                const monthly = Math.round((price + interest) / plan.months);
                const discount = interest;
                const totalCost = (price + interest - discount).toFixed(0);

                return (
                  <div
                    key={plan.months}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background shadow-sm hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-foreground">
                          ₹{monthly}
                        </span>
                        <span className="text-sm font-medium text-muted-foreground">
                          /mo
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">
                        for {plan.months} months
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-semibold text-foreground bg-muted px-2 py-0.5 rounded-full">
                        Total: ₹{totalCost}
                      </span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">
                        Int: ₹{Math.round(interest)} | Off:{" "}
                        <span className="text-red-500 font-medium">
                          -₹{Math.round(discount)}
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* REGULAR OFFERS SECTION */}
          {offers && offers.length > 0 && (
            <div className="divide-y divide-border/60 bg-muted/5">
              <div className="px-4 py-3 border-b border-border/60">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Other Bank Offers
                </span>
              </div>
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="px-4 py-3.5 flex flex-col gap-2 relative hover:bg-muted/10 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      {offer.type === "upi" ? (
                        <Zap className="w-4 h-4 text-primary" />
                      ) : offer.type === "netbanking" ? (
                        <Home className="w-4 h-4 text-primary" />
                      ) : (
                        <Banknote className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pr-8">
                      <p className="text-sm text-foreground font-medium leading-snug">
                        {offer.description}
                      </p>
                      {offer.minAmount && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Min. order:{" "}
                          <span className="font-semibold text-foreground">
                            ₹{offer.minAmount}
                          </span>
                        </p>
                      )}
                      <p className="text-[10px] text-primary cursor-pointer mt-1.5 font-semibold hover:underline w-fit">
                        T&amp;C Apply
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
