"use client";

import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import Navbar from "@/components/ui/Navbar";
import { WavyBackground } from "@/components/ui/wavy-background";
import WorldMap from "@/components/ui/world-map";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React, { lazy, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

const RecommendedFriends = lazy(() => import("@/components/RecommendedFriends"));

const INTEREST_OPTIONS = [
  "DSA", "CP", "UI-UX", "Figma", "Flutter",
  "React", "AppDev", "WebDev", "AI-ML",
  "Blockchain", "Cybersecurity", "GameDev"
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const words = ["Forever", "stronger", "better", "faster"];

const Home = () => {
  return (
    <div className="relative w-full h-screen overflow-visible bg-black">
      <BackgroundGradientAnimation />
      <Navbar />
      <HeroSection />
      <MemoziedDummyContent />
    </div>
  );
};

const HeroSection = () => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    variants={fadeInUp}
    className="absolute top-1/3 w-full z-10 flex flex-col items-center justify-center text-center px-4"
  >
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="w-[300px] h-[100px] rounded-full bg-white opacity-20 blur-2xl" />
      </div>
      <h1 className="relative z-10 text-7xl font-bold text-white">
        <span className="text-white/80">GRIND</span>
        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
          SPACE
        </span>
      </h1>
    </div>
    <ContainerTextFlipDemo />
  </motion.div>
);


const DummyContent = () => (
  <div className="flex flex-col w-full relative bg-[#0c001f] space-y-0">
    <MemoziedWavyBackgroundDemo />
    <RecommendedFriends />
    <MemoziedWorldMapDemo/>
  </div>
);


const MemoziedDummyContent = React.memo(DummyContent);

const WavyBackgroundDemo = () => (
  <WavyBackground className="max-w-4xl mx-auto">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      variants={fadeInUp}
      className="text-center"
    >
      <p className="text-2xl md:text-4xl lg:text-7xl text-white/80 font-bold inter-var">
        Find & Connect
      </p>
      <p className="text-base md:text-lg mt-4 text-gray-200 font-normal inter-var">
        with new people, opportunities and communities!
      </p>
    </motion.div>
  </WavyBackground>
);

const MemoziedWavyBackgroundDemo = React.memo(WavyBackgroundDemo);


import emailjs from "@emailjs/browser";
import { useRef } from "react";

const WorldMapDemo = () => {
  const form = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_c4r3586",   // replace with your Service ID
        "template_we3ryei",  // replace with your Template ID
        form.current,
        "ypqKsaSaGDRHerKJ1"    // replace with your Public Key
      )
      .then(
        (result) => {
          console.log(result.text);
          alert("Thank you! Our team will reach out to you.");
          e.target.reset();
        },
        (error) => {
          console.log(error.text);
          alert("Oops! Something went wrong. Please try again.");
        }
      );
  };

  return (
    <div className="bg-black w-full py-6 relative">
      <div className="max-w-7xl mx-auto text-center">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          variants={fadeInUp}
          className="font-bold text-xl md:text-4xl text-white"
        >
          Contact{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
            Us
          </span>
        </motion.p>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          variants={fadeInUp}
          className="text-sm md:text-lg text-gray-300 max-w-2xl mx-auto py-4"
        >
          Break free from traditional boundaries. Study together and make a better future.
        </motion.p>
      </div>

      <motion.form
        ref={form} // added ref
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        variants={fadeInUp}
        onSubmit={handleSubmit}
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 rounded-lg p-6 max-w-md w-full z-20 shadow-lg"
      >
        <label htmlFor="name" className="block text-white font-medium mb-1">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Your Name"
          className="w-full mb-4 px-3 py-2 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <label htmlFor="email" className="block text-white font-medium mb-1">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="w-full mb-4 px-3 py-2 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <label htmlFor="purpose" className="block text-white font-medium mb-1">Purpose</label>
        <input
          id="purpose"
          name="purpose"
          type="text"
          required
          placeholder="Would like to contribute"
          className="w-full mb-4 px-3 py-2 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white font-semibold py-2 rounded hover:bg-purple-700 transition-colors"
        >
          Submit
        </button>
        <p className="mt-3 text-sm text-white">Our team will reach out to you shortly.</p>
      </motion.form>

      <WorldMap
        dots={[
          { start: { lat: 64.2008, lng: -149.4937 }, end: { lat: 34.0522, lng: -118.2437 } },
          { start: { lat: 64.2008, lng: -149.4937 }, end: { lat: -15.7975, lng: -47.8919 } },
          { start: { lat: -15.7975, lng: -47.8919 }, end: { lat: 38.7223, lng: -9.1393 } },
          { start: { lat: 51.5074, lng: -0.1278 }, end: { lat: 28.6139, lng: 77.209 } },
          { start: { lat: 28.6139, lng: 77.209 }, end: { lat: 43.1332, lng: 131.9113 } },
          { start: { lat: 28.6139, lng: 77.209 }, end: { lat: -1.2921, lng: 36.8219 } },
        ]}
      />
    </div>
  );
};

const MemoziedWorldMapDemo = React.memo(WorldMapDemo);

const ContainerTextFlipDemo = () => {
  const navigate = useNavigate();
  const [showInterestModal, setShowInterestModal] = useState(false);

  const handleCreateRoom = useCallback(() => {
    const callId = Math.floor(Math.random() * 91) + 10; // 10-100
    navigate(`/call/${callId}`);
  }, [navigate]);

  const handleJoinGroup = useCallback(
    (interest) => {
      setShowInterestModal(false);
      navigate(`/call/${interest}`);
    },
    [navigate]
  );

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={cn("relative mb-6 max-w-2xl text-sm text-center leading-normal tracking-tight text-shadow-indigo-50 md:text-lg")}
      >
        <div className="inline-block">Explore together. Build<ContainerTextFlip words={words} /></div>
      </motion.h1>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        variants={fadeInUp}
        className="mt-4 w-full flex items-center justify-center gap-4"
      >
        <HoverBorderGradient
          containerClassName="rounded-full"
          as="button"
          onClick={() => setShowInterestModal(true)}
          className="bg-black/20 text-white flex items-center space-x-2"
        >
          <span>Join a study group</span>
        </HoverBorderGradient>

        <HoverBorderGradient
          containerClassName="rounded-full"
          as="button"
          onClick={handleCreateRoom}
          className="bg-black/20 text-white flex items-center space-x-2"
        >
          <span>Make a study group</span>
        </HoverBorderGradient>
      </motion.div>

      {showInterestModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-[#0c001f] rounded-2xl p-6 shadow-2xl w-96 border border-white/10"
          >
            <h2 className="text-xl font-bold mb-4 text-white text-center">
              What are you studying right now?
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {INTEREST_OPTIONS.map((interest) => (
                <button
                  key={interest}
                  onClick={() => handleJoinGroup(interest)}
                  className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:opacity-90 transition"
                >
                  {interest}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowInterestModal(false)}
              className="mt-6 w-full px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home;
