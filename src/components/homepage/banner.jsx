"use client";

import React from "react";
import Carousel from "@/components/carousel";

const Banner = () => {
    const slides = [
        <div className="relative h-[500px] flex items-center justify-center bg-cover bg-center bg-[url('https://images.pexels.com/photos/2080960/pexels-photo-2080960.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')]">
            <div className="bg-black bg-opacity-50 p-4 rounded">
                <h2 className="text-white text-2xl font-bold mb-2">Welcome to Our Service</h2>
                <p className="text-white mb-4">Experience the best with us.</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Learn More</button>
            </div>
        </div>,
        <div className="relative h-[500px] flex items-center justify-center bg-cover bg-center bg-[url('https://picsum.photos/1080/1920')]">
            <div className="bg-black bg-opacity-50 p-4 rounded">
                <h2 className="text-white text-2xl font-bold mb-2">Our Latest Projects</h2>
                <p className="text-white mb-4">Discover what we've been working on.</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">View Projects</button>
            </div>
        </div>,
        <div className="relative h-[500px] flex items-center justify-center bg-cover bg-center bg-[url('https://picsum.photos/1080/1920')]">
            <div className="bg-black bg-opacity-50 p-4 rounded">
                <h2 className="text-white text-2xl font-bold mb-2">Join Our Team</h2>
                <p className="text-white mb-4">We're hiring! Apply now.</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Careers</button>
            </div>
        </div>,
    ];


    return (
        <section className="w-full">
            <Carousel
                slides={slides}
                options={{ loop: true, align: "center" }}
                plugins={[]}
                showIndicators={true}
                showNavigation={true}
                showStartStop={true}
                stopOnMouseEnter={false}
                autoplayOptions={{ delay: 500 }}
                autoHeight={true}
                autoScrollOptions={{ speed: 1 }}
            />
        </section>
    );
};

export default Banner;
