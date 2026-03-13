"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  MoveHorizontal,
  Link,
  ArrowUpDown,
  type LucideIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Badge } from "./badge";

const REGIONS = ["ASIA", "EUROPE", "US", "UK"] as const;

const SIZE_DATA = [
  {
    chest: [34, 36],
    waist: [28, 30],
    hip: [34, 36],
    sizes: { ASIA: "S", EUROPE: "44", US: "XS", UK: "XS" },
  },
  {
    chest: [36, 38],
    waist: [30, 32],
    hip: [36, 38],
    sizes: { ASIA: "M", EUROPE: "46", US: "S", UK: "S" },
  },
  {
    chest: [38, 40],
    waist: [32, 34],
    hip: [38, 40],
    sizes: { ASIA: "L", EUROPE: "48", US: "M", UK: "M" },
  },
  {
    chest: [40, 42],
    waist: [34, 36],
    hip: [40, 42],
    sizes: { ASIA: "XL", EUROPE: "50", US: "L", UK: "L" },
  },
  {
    chest: [42, 44],
    waist: [36, 38],
    hip: [42, 44],
    sizes: { ASIA: "XXL", EUROPE: "52", US: "XL", UK: "XL" },
  },
];

interface MeasureItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

function MeasureItem({
  icon: Icon,
  title,
  description,
  className = "",
}: MeasureItemProps) {
  return (
    <div className="flex gap-3 items-start">
      <Icon className={`w-4 h-4 text-primary shrink-0 mt-0.5 ${className}`} />
      <div>
        <span className="text-sm font-semibold text-foreground block mb-0.5">
          {title}
        </span>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function convert(value: number, unit: "in" | "cm") {
  if (unit === "in") return value;
  return Math.round(value * 2.54);
}

function formatRange(range: number[], unit: "in" | "cm") {
  const min = convert(range[0], unit);
  const max = convert(range[1], unit);
  return `${min}-${max}`;
}

export interface SizeChartProps {
  category?: string;
  brand?: string;
}

export function SizeChart({ category, brand }: SizeChartProps = {}) {
  const [region, setRegion] = useState<(typeof REGIONS)[number]>("ASIA");
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const recommendedSize = useMemo(() => {
    const h = Number(height);
    const w = Number(weight);
    if (!h || !w) return null;

    if (h < 165 && w < 60) return SIZE_DATA[0];
    if (h < 172 && w < 70) return SIZE_DATA[1];
    if (h < 178 && w < 80) return SIZE_DATA[2];
    if (h < 185 && w < 90) return SIZE_DATA[3];
    return SIZE_DATA[4];
  }, [height, weight]);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-2 sm:p-4 overflow-y-auto">
      <div className="flex-1 space-y-6 md:w-3/5">
        <div className="flex items-center justify-between gap-1">
          <Tabs
            value={region}
            className="p-0"
            onValueChange={(v) => setRegion(v as (typeof REGIONS)[number])}
          >
            <TabsList className="grid grid-cols-4">
              {REGIONS.map((r) => (
                <TabsTrigger key={r} value={r}>
                  {r}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <ToggleGroup
            type="single"
            value={unit}
            variant="outline"
            size="default"
            onValueChange={(v) => v && setUnit(v as "in" | "cm")}
          >
            <ToggleGroupItem className="w-1/2" value="in">
              in
            </ToggleGroupItem>
            <ToggleGroupItem className="w-1/2" value="cm">
              cm
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <Card>
          <CardHeader className="w-full flex items-center gap-1 justify-between">
            <CardTitle>Find Your Size</CardTitle>
            {recommendedSize && (
              <div className="text-sm text-muted-foreground">
                Recommended Size:{" "}
                <Badge variant="secondary" color="info">
                  {
                    recommendedSize.sizes[
                      region as keyof typeof recommendedSize.sizes
                    ]
                  }
                </Badge>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="Height (cm)"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
              <Input
                placeholder="Weight (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Tabs value={region} className="p-0">
          <TabsContent value={region}>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader sticky>
                  <TableRow>
                    <TableHead>Size</TableHead>
                    <TableHead>Chest ({unit})</TableHead>
                    <TableHead>Waist ({unit})</TableHead>
                    <TableHead>Hip ({unit})</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {SIZE_DATA.map((row) => (
                    <TableRow key={row.chest.join("-")}>
                      <TableCell className="font-medium">
                        {row.sizes[region]}
                      </TableCell>

                      <TableCell>{formatRange(row.chest, unit)}</TableCell>

                      <TableCell>{formatRange(row.waist, unit)}</TableCell>

                      <TableCell>{formatRange(row.hip, unit)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 pt-4 border-t border-border/40 text-center">
              <p className="text-sm text-muted-foreground">
                Reference this chart to select the perfect fit.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Card className="md:w-2/5 shrink-0 bg-muted/20 p-0">
        <CardHeader className="border-b p-4!">
          <CardTitle>How to Measure</CardTitle>
          <CardDescription>
            Use a measuring tape and follow these simple steps:
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <MeasureItem
            icon={MoveHorizontal}
            title="Chest"
            description="Measure around the fullest part of your chest."
          />

          <MeasureItem
            icon={Link}
            className="rotate-45"
            title="Waist"
            description="Measure around your natural waistline."
          />

          <MeasureItem
            icon={ArrowUpDown}
            title="Hips"
            description="Measure around the widest part of your hips."
          />
          <Image
            src="/images/size_guide_illustration.png"
            alt="Body measurement guide"
            width={500}
            height={500}
            className="max-w-4/5 object-contain border border-border rounded-2xl mx-auto"
          />

          <CardFooter className="text-xs text-center text-muted-foreground mt-4">
            Reference this guide for accurate sizing.
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}

export default SizeChart;
