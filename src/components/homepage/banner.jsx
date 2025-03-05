"use client";

import React from "react";
import Image from "next/image";
import Carousel from "../carousel";
import { motion } from "framer-motion";

const Banner = () => {
    const slides = [
        <Image src="/bannerOne.webp" alt="Banner One" className="w-full brightness-75 object-cover" fill="cover" />,
        <Image src="/bannerTwo.webp" alt="Banner Two" className="w-full brightness-75 object-cover" fill="cover" />,
        <Image src="/bannerThree.webp" alt="Banner Three" className="w-full brightness-75 object-cover" fill="cover" />,
        <Image src="/bannerFour.webp" alt="Banner Four" className="w-full brightness-75 object-cover" fill="cover" />,
    ];


    return (
        <motion.div className="w-full">
            <Carousel
                slides={slides}
                options={{ loop: true, align: "center" }}
                showNavigation={true}
                showIndicators={true}
                showStartStop={true}
                autoHeight={true}
                autoScrollOptions={{ speed: 2 }}
            />
        </motion.div>
    );
};

export default Banner;
