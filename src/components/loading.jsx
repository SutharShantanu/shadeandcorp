"use client";

import React from 'react'
import { Spinner } from './ui/spinner'
import { motion } from 'framer-motion'

const Loading = () => {
    return (
        <div className="loading-container relative bg-background text-foreground">
            {/* Blur Background */}
            <motion.div
                className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"
                initial={{ filter: 'blur(10px)' }}
                animate={{ filter: 'blur(0px)' }}
                transition={{ duration: 1 }}
            ></motion.div>

            {/* Title */}
            <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 25, duration: 1 }}
                className="text-primary-foreground z-10"
            >
                Oh great, more waiting...
            </motion.h1>

            {/* Animated Spinner */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="z-10"
            >
                <Spinner />
            </motion.div>
        </div>
    )
}

export default Loading
