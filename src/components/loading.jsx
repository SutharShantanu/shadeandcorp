"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
    return (
        <div className="loading-container bg-background text-foreground min-h-screen flex flex-col items-center justify-center select-none overflow-hidden relative">
            {/* Background Overlay */}
            <motion.div
                className="absolute inset-0 bg-background bg-opacity-60 z-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            />

            {/* Loading Text */}
            <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 25, duration: 1 }}
                className="text-primary-default text-2xl font-semibold z-10 mb-8"
            >
                Oh great, more waiting...
            </motion.h1>

            {/* Spinner Dots Container */}
            <div className="relative w-24 h-6 z-10">
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.7, repeat: Infinity, }}
                    className="absolute size-3.5 rounded-full bg-current left-2"
                ></motion.span>
                <motion.span
                    initial={{ x: 0 }}
                    animate={{ x: 6 }}
                    transition={{ duration: 0.7, repeat: Infinity, }}
                    className="absolute size-3.5 rounded-full bg-current left-2"
                ></motion.span>
                <motion.span
                    initial={{ x: 0 }}
                    animate={{ x: 6 }}
                    transition={{ duration: 0.7, repeat: Infinity, }}
                    className="absolute size-3.5 rounded-full bg-current left-8"
                ></motion.span>
                <motion.span
                    initial={{ scale: 1 }}
                    animate={{ scale: 0 }}
                    transition={{ duration: 0.7, repeat: Infinity, }}
                    className="absolute size-3.5 rounded-full bg-current left-14"
                ></motion.span>
            </div>
        </div>
    );
};

export default Loading;
