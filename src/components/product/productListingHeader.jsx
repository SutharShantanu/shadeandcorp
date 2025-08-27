"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { motion } from 'framer-motion';
import { LayoutGrid, List } from 'lucide-react';

const layoutOptions = [
    { type: 'grid', icon: LayoutGrid },
    { type: 'list', icon: List }
];

const sortOptions = [
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'popularity', label: 'Popularity' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Rating' },
    { value: 'relevance', label: 'Relevance' }
];

const ProductListingHeader = ({ layout, onSortChange, onLayoutChange }) => (
    <motion.div
        className="flex items-center gap-4 bg-transparent border-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <Select onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px] flex items-center gap-2 text-primary-default bg-primary-foreground border border-border">
                <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-primary-foreground">
                {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>

        <motion.div className="flex gap-2">
            {layoutOptions.map(({ type, icon: Icon }) => (
                <Button
                    key={type}
                    className={`border rounded-xs ${layout === type ? 'bg-primary-default text-primary-foreground' : 'bg-primary-foreground text-primary-default'}`}
                    onClick={() => onLayoutChange(type)}
                >
                    <Icon className={`${layout === type ? 'text-primary-foreground' : 'text-primary-default'}`} />
                </Button>
            ))}
        </motion.div>
    </motion.div>
);

export default ProductListingHeader;
