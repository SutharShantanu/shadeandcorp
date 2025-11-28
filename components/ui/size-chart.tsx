"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Ruler, Baby, Venus, Mars } from "lucide-react";

export type SizeChartRow = {
    label: string;
    chest?: number; // stored as inches
    waist?: number; // inches
    hip?: number; // inches
};

export type SizeChartData = {
    gender: "men" | "women" | "kids";
    rows: SizeChartRow[];
};

function toCm(inches?: number) {
    if (inches == null) return undefined;
    return Math.round(inches * 2.54 * 10) / 10; // one decimal
}

export interface SizeChartProps {
    brand?: string;
    category?: string;
    charts?: SizeChartData[]; // optional custom charts per gender
}

const defaultCharts: SizeChartData[] = [
    {
        gender: "men",
        rows: [
            { label: "S", chest: 36, waist: 30 },
            { label: "M", chest: 40, waist: 34 },
            { label: "L", chest: 44, waist: 38 },
            { label: "XL", chest: 48, waist: 42 },
            { label: "XXL", chest: 52, waist: 46 },
        ],
    },
    {
        gender: "women",
        rows: [
            { label: "XS", chest: 32, waist: 24, hip: 34 },
            { label: "S", chest: 34, waist: 26, hip: 36 },
            { label: "M", chest: 36, waist: 28, hip: 38 },
            { label: "L", chest: 39, waist: 31, hip: 41 },
            { label: "XL", chest: 42, waist: 34, hip: 44 },
        ],
    },
    {
        gender: "kids",
        rows: [
            { label: "XS", chest: 33, waist: 26 },
            { label: "S", chest: 36, waist: 29 },
            { label: "M", chest: 39, waist: 32 },
            { label: "L", chest: 42, waist: 35 },
            { label: "XL", chest: 45, waist: 38 },
        ],
    },
];

export function SizeChart({ brand, category, charts = defaultCharts }: SizeChartProps) {
    const [unit, setUnit] = React.useState<"in" | "cm">("in");
    const [gender, setGender] = React.useState<"men" | "women" | "kids">(
        charts[0]?.gender ?? "kids"
    );

    const current = charts.find((c) => c.gender === gender) ?? defaultCharts[2];

    const format = (val?: number) => {
        if (val == null) return "-";
        return unit === "in" ? `${val}"` : `${toCm(val)} cm`;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    {brand && <span>Brand: {brand}</span>} {brand && category && " • "}
                    {category && <span>Category: {category}</span>}
                </div>
                <ToggleGroup variant="outline" type="single" value={unit} onValueChange={(v: string) => v && setUnit(v as "in" | "cm")}>
                    <ToggleGroupItem className="w-1/2" value="in">
                        in
                    </ToggleGroupItem>
                    <ToggleGroupItem className="w-1/2" value="cm">
                        cm
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>

            <Tabs value={gender} onValueChange={(v: string) => setGender(v as "men" | "women" | "kids")}>
                <TabsList>
                    <TabsTrigger value="men">
                        <Mars className="mr-1.5 h-4 w-4" />
                        Men
                    </TabsTrigger>
                    <TabsTrigger value="women">
                        <Venus className="mr-1.5 h-4 w-4" />
                        Women
                    </TabsTrigger>
                    <TabsTrigger value="kids">
                        <Baby className="mr-1.5 h-4 w-4" />
                        Kids
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="overflow-x-auto border rounded-lg">
                <Table className="">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Size</TableHead>
                            <TableHead>Chest ({unit})</TableHead>
                            <TableHead>Waist ({unit})</TableHead>
                            {current.rows.some((r) => r.hip != null) && (
                                <TableHead>Hip ({unit})</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {current.rows.map((row) => (
                            <TableRow key={`${gender}-${row.label}`} striped>
                                <TableCell className="font-medium">{row.label}</TableCell>
                                <TableCell>{format(row.chest)}</TableCell>
                                <TableCell>{format(row.waist)}</TableCell>
                                {current.rows.some((r) => r.hip != null) && (
                                    <TableCell>{format(row.hip)}</TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="text-xs text-muted-foreground">
                Tip: Measurements are approximate. If between sizes, choose the larger.
            </div>
        </div>
    );
}

export default SizeChart;
