"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  ...props
}) {
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState("TOP");

  const rotateDirection = (currentDirection) => {
    const directions = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  const movingMap = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)",
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)",
    BOTTOM: "radial-gradient(20.7% 50% at 50% 100%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)",
    RIGHT: "radial-gradient(16.2% 41.2% at 100% 50%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)",
  };

  const highlight =
    "radial-gradient(75% 181% at 50% 50%, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)";

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prev) => rotateDirection(prev));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, duration]);

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex rounded-full border border-transparent bg-black/10 hover:bg-black/5 transition duration-500 items-center justify-center overflow-visible p-px w-fit cursor-pointer",
        containerClassName
      )}
      {...props}
    >
      {/* Animated moving border (no pointer blocking) */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{
          filter: "blur(3px)",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [movingMap[direction], highlight]
            : movingMap[direction],
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />

      {/* Inner black padding (no pointer blocking) */}
      <div className="absolute inset-[2px] rounded-[inherit] bg-black/20 pointer-events-none" />

      {/* Text content (clickable) */}
      <div
        className={cn(
          "relative w-auto text-white z-10 bg-black/20 px-4 py-2 rounded-[inherit] backdrop-blur-sm italic",
          className
        )}
      >
        {children}
      </div>
    </Tag>
  );
}
