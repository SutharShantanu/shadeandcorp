"use client";


import React from 'react';
import Carousel from '@/components/carousel';
import AutoplayPlugin from 'embla-carousel-autoplay';

const Banner = () => {

    const slides = [
        <div className="bg-blue-500 h-[500px] flex items-center justify-center text-white">
            Slide 1
        </div>,
        <div className="bg-red-500 h-[500px] flex items-center justify-center text-white">
            Slide 2
        </div>,
        <div className="bg-green-500 h-[500px] flex items-center justify-center text-white">
            Slide 3
        </div>,
    ];

    const options = {
        loop: true,
        align: "center",
    };
    return (
        <div className="">
            <Carousel
                slides={slides}
                plugins={[AutoplayPlugin()]}
                showIndicators={true}
                showNavigation={true}
                showStartStop={true}
                stopOnMouseEnter={true}
                autoplayOptions={{ delay: 3000 }}
                autoHeight={true}
            />
        </div>
    )
}

export default Banner;