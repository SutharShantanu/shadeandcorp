import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const timeParts = [
  { prefix: "", value: "days", suffix: "D" },
  { prefix: ":", value: "hours", suffix: "H" },
  { prefix: ":", value: "minutes", suffix: "M" },
  { prefix: ":", value: "seconds", suffix: "S" },
];

const AnimatedGradientText = ({ timeLeft, className }) => {
  console.log(timeLeft);
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={JSON.stringify(timeLeft)}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 80 }}
      >
        <span
          className={cn(
            "inline-flex animate-text-gradient bg-linear-to-r from-accent-default via-rating-default to-destructive-default bg-[200%_auto] text-transparent bg-clip-text text-nowrap w-fit",
            className
          )}
        >
          {timeLeft &&
            timeParts.map(({ prefix, value, suffix }, idx) => (
              <span key={idx}>
                {prefix}
                <span className="font-bold">{timeLeft[value]}</span>
                {suffix}
              </span>
            ))}
        </span>
      </motion.span>
    </AnimatePresence>
  );
};

export default AnimatedGradientText;
