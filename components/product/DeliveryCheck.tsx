"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Truck, AlertCircle, Navigation, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  InputGroup,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function DeliveryCheck() {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState<null | "ok" | "fail">(null);
  const [checking, setChecking] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationName, setLocationName] = useState<string | null>(null);

  const check = async () => {
    if (pincode.length !== 6) {
      toast.error("Enter a valid 6 digit pincode");
      return;
    }

    setChecking(true);
    setStatus(null);
    setLocationName(null);

    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const data = await res.json();

      if (
        data &&
        data[0] &&
        data[0].Status === "Success" &&
        data[0].PostOffice &&
        data[0].PostOffice.length > 0
      ) {
        setStatus("ok");
        const po = data[0].PostOffice[0];
        setLocationName(`${po.Name}, ${po.State}`);
      } else {
        setStatus("fail");
      }
    } catch (err) {
      // Fallback
      setTimeout(() => {
        setStatus(Math.random() > 0.2 ? "ok" : "fail");
      }, 800);
    } finally {
      // Small artificially delay so skeleton shows briefly for good UX
      setTimeout(() => setChecking(false), 500);
    }
  };

  useEffect(() => {
    if (pincode.length === 6) {
      if (!checking) check();
    } else {
      setStatus(null);
      setLocationName(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pincode]);

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsDetectingLocation(true);
    const toastId = toast.loading("Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { "User-Agent": "ShadeAndCo/1.0" } },
          );

          if (!response.ok) throw new Error();

          const { address } = await response.json();
          if (address.postcode) {
            setPincode(address.postcode);
            toast.success("Location detected successfully!", { id: toastId });
          } else {
            toast.error("Could not determine your pin code from location.", {
              id: toastId,
            });
          }
        } catch (error) {
          toast.error("Failed to detect location details.", { id: toastId });
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        setIsDetectingLocation(false);
        const errorMap: Record<number, string> = {
          1: "Location permission denied.",
          2: "Location information unavailable.",
          3: "Location request timed out.",
        };
        toast.error(errorMap[error.code] || "Failed to detect location", {
          id: toastId,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const getDeliveryDates = () => {
    const start = new Date(Date.now() + 3 * 86400000);
    const end = new Date(Date.now() + 5 * 86400000);

    return `${start.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })} - ${end.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })}`;
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1 justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-base font-medium text-nowrap">Check Delivery</h3>
        </div>
        <InputGroup className="transition-all duration-300 overflow-hidden w-fit group/input-group">
          <InputGroupInput
            placeholder="Enter 6-digit pincode"
            value={pincode}
            maxLength={6}
            onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ""))}
            className="border-none focus-visible:ring-0 shadow-none h-full bg-transparent w-fit"
          />

          <InputGroupButton
            type="button"
            variant="ghost"
            onClick={
              pincode.length > 0
                ? () => {
                    if (!checking) {
                      setPincode("");
                      setStatus(null);
                      setLocationName(null);
                    }
                  }
                : detectLocation
            }
            disabled={checking || (pincode.length === 0 && isDetectingLocation)}
            className={cn(
              "overflow-hidden transition-all duration-300 h-full rounded-none hover:bg-transparent shrink-0 px-0 flex justify-center items-center text-muted-foreground",
              pincode.length > 0 || isDetectingLocation || checking
                ? "w-10 opacity-100 border-l"
                : "w-0 opacity-0 border-l-0 pointer-events-none group-focus-within/input-group:w-10 group-focus-within/input-group:opacity-100 group-focus-within/input-group:pointer-events-auto group-focus-within/input-group:border-l",
            )}
            title={pincode.length > 0 ? "Clear" : "Detect Location"}
          >
            <AnimatePresence mode="wait">
              {checking ? (
                <motion.div
                  key="checking"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Spinner className="w-4 h-4 text-primary shrink-0" />
                </motion.div>
              ) : pincode.length > 0 ? (
                <motion.div
                  key="clear"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-4 h-4 shrink-0 transition-colors hover:text-foreground" />
                </motion.div>
              ) : isDetectingLocation ? (
                <motion.div
                  key="detecting"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Spinner className="w-4 h-4 text-primary shrink-0" />
                </motion.div>
              ) : (
                <motion.div
                  key="detect"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Navigation className="w-4 h-4 text-primary fill-primary shrink-0" />
                </motion.div>
              )}
            </AnimatePresence>
          </InputGroupButton>
        </InputGroup>
      </div>

      <AnimatePresence mode="popLayout">
        {status === "ok" && !checking && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2 rounded-xl py-3 px-4 border border-border"
          >
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Truck className="h-4 w-4" />
              <span className="font-medium">
                {locationName && `Delivering to: ${locationName}`}
                <br />
                Delivery by {getDeliveryDates()}
              </span>
              <Badge
                variant="secondary"
                className="ml-1 text-xs px-2 py-0 h-5 bg-muted/50 rounded-full"
              >
                Free
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Order within 3 hrs 12 mins for fastest dispatch.
            </p>
          </motion.div>
        )}
        {status === "fail" && !checking && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Alert variant="destructive" className="py-3">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Sorry, we don't currently deliver to this location.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
