import React from 'react';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { Loader } from 'lucide-react';

const loaderVariants = cva('animate-spin text-primary', {
    variants: {
        size: {
            small: 'size-6',
            medium: 'size-8',
            large: 'size-12',
        },
    },
    defaultVariants: {
        size: 'small',
    },
});

export function Spinner({ size = 'medium', children, className }) {
    return (
        <span className="flex flex-col items-center justify-center">
            <Loader className={cn(loaderVariants({ size }), className)} />
            {children}
        </span>
    );
}
