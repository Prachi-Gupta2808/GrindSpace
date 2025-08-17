"use client";

import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import Navbar from "@/components/ui/navbar";
import YourFriends from "@/components/yourFriends";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import useAuthUser from "../hooks/useAuthUser";

const Profile = () => {
  const { authUser, isLoading } = useAuthUser();

  if (isLoading)
    return (
      <p className="text-white text-center mt-20">Loading your profile...</p>
    );
  if (!authUser)
    return (
      <p className="text-white text-center mt-20">You are not logged in.</p>
    );

  return (
    <div className="relative min-h-screen w-full">
      {/* Gradient Background always behind everything */}
      <BackgroundGradientAnimation />
      <Navbar className="relative z-20" />

      <main
        className={cn(
          "absolute top-20 left-1/2 transform -translate-x-1/2 z-30 max-w-5xl w-full p-6 flex flex-col gap-16"
        )}
      >
        {/* Profile section with animation */}
        <div className="flex gap-10">
          {/* Left: Profile Picture */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-shrink-0 w-full max-w-xs rounded-xl shadow-lg overflow-hidden h-[30rem] bg-gray-900/50 opacity-95 border-2 border-white"
          >
            {authUser.profilePic ? (
              <img
                src={authUser.profilePic}
                alt={`${authUser.fullName}'s profile`}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 text-white flex items-center justify-center text-center text-sm p-4">
                No Profile Picture Available
              </div>
            )}
          </motion.div>

          {/* Right: User Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 bg-black/50 backdrop-blur-md backdrop-saturate-150 rounded-xl shadow-xs p-10 text-white flex flex-col justify-center space-y-6"
          >
            <h1 className="text-5xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
                {authUser.fullName}
              </span>
            </h1>
            <p className="text-lg text-white/60 lowercase tracking-wide">
              @{authUser.username}
            </p>
            <p className="text-lg">
              <strong>Email:</strong> {authUser.email}
            </p>
            {authUser.bio && (
              <p className="text-lg">
                <strong>Bio:</strong> {authUser.bio}
              </p>
            )}
            {authUser.primaryInterests &&
              authUser.primaryInterests.length > 0 && (
                <div className="text-lg">
                  <strong>Interests:</strong>{" "}
                  {authUser.primaryInterests.join(", ")}
                </div>
              )}
          </motion.div>
        </div>
      </main>
      {/* Your Connections section */}
      <div className="space-y-4">
        <div className="bg-black">
          <YourFriends />
        </div>
      </div>
    </div>
  );
};

export default Profile;
