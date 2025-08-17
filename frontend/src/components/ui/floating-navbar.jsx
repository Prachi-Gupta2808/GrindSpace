"use client";

import useLogout from "@/hooks/useLogout";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export const FloatingNav = ({ navItems, className }) => {
  const [visible, setVisible] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const { logoutMutation } = useLogout();

  // Scroll hide/show logic
  useEffect(() => {
    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      setVisible(currentScrollY < 10 || currentScrollY < lastScrollY.current || currentScrollY === 0);
      lastScrollY.current = currentScrollY;
      ticking.current = false;
    };
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScroll);
        ticking.current = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const confirmLogout = () => {
    logoutMutation();
    setShowLogoutModal(false);
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "fixed top-6 inset-x-0 z-[5000] mx-auto max-w-fit px-6 py-2 rounded-full border flex items-center space-x-6",
              "bg-[#1a1a1a]/30 backdrop-blur-md border-white/30 shadow-xl",
              className
            )}
          >
            {navItems.map((navItem, idx) => (
              <Link
                key={`nav-item-${idx}`}
                to={navItem.link}
                className="relative group w-8 h-8 flex items-center justify-center"
              >
                <span className="absolute transition-opacity duration-300 group-hover:opacity-0 text-white">
                  {navItem.icon}
                </span>
                <span className="absolute transition-opacity duration-300 opacity-0 group-hover:opacity-100 text-sky-300 text-sm font-medium">
                  {navItem.name}
                </span>
              </Link>
            ))}

            <button
              onClick={() => setShowLogoutModal(true)}
              className="text-sm font-medium px-4 py-1.5 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-[6000]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-black/60 rounded-2xl p-6 shadow-2xl w-96 border border-white/10 text-center"
            >
              <h2 className="text-white text-xl font-bold mb-4">Do you want to log out?</h2>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={confirmLogout}
                  className="px-6 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 hover:opacity-90 transition"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-6 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:opacity-90 transition"
                >
                  No
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
