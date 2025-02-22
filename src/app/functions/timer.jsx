import { useState, useEffect } from "react";

/**
 * Custom hook to create a countdown timer.
 *
 * @param {Date|string} targetDate - The target date and time for the countdown.
 * @returns {Object} An object containing the time left in days, hours, minutes, and seconds.
 *
 * @example
 * const targetDate = new Date('2023-12-31T23:59:59');
 * const { days, hours, minutes, seconds } = useCountdown(targetDate);
 */
export const useCountdown = (targetDate) => {
    const calculateTimeLeft = () => {
        const difference = new Date(targetDate) - new Date();
        return difference > 0
            ? {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / (1000 * 60)) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            }
            : { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return timeLeft;
};

