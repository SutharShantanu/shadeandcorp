// "use client";

// import { useEffect } from 'react';
// import Lenis from 'lenis';

// export default function LenisProvider ({ children }) {
//     useEffect(() => {
//         const lenis = new Lenis({
//             lerp: 0.05,              // Lower value = smoother but slower follow-through
//             smoothWheel: true,       // Smooth mouse wheel scrolling
//             smoothTouch: true,        // Smooth touch scrolling (mobile)
//             syncTouch: true,         // Sync touch events for better mobile performance
//             touchMultiplier: 1.5,     // Faster touch scroll momentum
//             wheelMultiplier: 1.2,     // Slightly faster wheel scroll
//             infinite: false,          // Disable infinite scrolling
//         });

//         const raf = (time) => {
//             lenis.raf(time);
//             requestAnimationFrame(raf);
//         };

//         requestAnimationFrame(raf);

//         return () => {
//             lenis.destroy();
//             window.cancelAnimationFrame(raf);
//         };
//     }, []);

//     return children;
// }