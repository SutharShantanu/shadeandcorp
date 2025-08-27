import { useState, useEffect } from "react";

/**
 * Custom hook to create a countdown timer.
 *
 * @param {Date|string} targetDate - The target date and time for the countdown.
 * @returns {Object|null} An object containing the time left in days, hours, minutes, and seconds, or `null` if time has expired.
 */
export const useCountdown = (targetDate) => {
    const calculateTimeLeft = () => {
        const difference = new Date(targetDate) - new Date();
        if (difference <= 0) return null;

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / (1000 * 60)) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        if (!timeLeft) return;

        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            if (!newTimeLeft) {
                clearInterval(timer);
            }
            setTimeLeft(newTimeLeft);
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate, timeLeft]);

    return timeLeft;
};
