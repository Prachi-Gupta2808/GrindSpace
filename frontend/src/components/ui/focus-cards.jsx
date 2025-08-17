"use client";

import { axiosInstance } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Vortex } from "../ui/vortex";

export const Card = React.memo(({ card, index, hovered, setHovered, onSelect }) => (
  <motion.div
    onMouseEnter={() => setHovered(index)}
    onMouseLeave={() => setHovered(null)}
    onClick={() => onSelect(card)}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className={cn(
      "rounded-xl relative overflow-hidden h-96 w-full transition-all duration-300 ease-out opacity-80 cursor-pointer",
      hovered !== null && hovered !== index && "blur-[1px] scale-[0.98]"
    )}
  >
    <img
      src={card.src}
      alt={card.title}
      className="object-cover absolute inset-0 w-full h-full"
    />
    <div
      className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end py-6 px-4 transition-opacity duration-300",
        hovered === index ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#A2D2FF] to-[#CDB4DB]">
        {card.title}
      </div>
    </div>
  </motion.div>
));

Card.displayName = "Card";

export function FocusCards({ cards }) {
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  const handleSelect = useCallback(async (card) => {
    const profilePic = card.src;
    const token = localStorage.getItem("token");

    try {
      await axiosInstance.post(
        "http://localhost:5001/api/auth/choose-profile",
        { profilePic, hasChosenProfile: true },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      localStorage.setItem("profilePic", profilePic);
      navigate("/onboarding");
    } catch (err) {
      console.error("Failed to choose profile:", err?.response?.data?.message || err.message);
    }
  }, [navigate]);

  return (
    <div className="w-full h-screen overflow-hidden relative z-0">
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={250}
        className="flex flex-col items-center justify-center px-4 py-6 w-full h-full relative z-10"
      >
        <h2 className="text-white text-lg md:text-5xl font-bold text-center mb-8">
          Choose your Avatar
        </h2>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full max-w-7xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {cards.map((card, index) => (
            <Card
              key={card.title}
              card={card}
              index={index}
              hovered={hovered}
              setHovered={setHovered}
              onSelect={handleSelect}
            />
          ))}
        </motion.div>
      </Vortex>
    </div>
  );
}
