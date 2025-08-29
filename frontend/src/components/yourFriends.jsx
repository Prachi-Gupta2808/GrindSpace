"use client";

import { CardSpotlight } from "@/components/ui/card-spotlight";
import { getUserFriends } from "@/lib/api";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const YourFriends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFriends() {
      try {
        const data = await getUserFriends();
        if (Array.isArray(data)) {
          setFriends(data);
        } else if (data.friends && Array.isArray(data.friends)) {
          setFriends(data.friends);
        } else {
          setFriends([]);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
        setFriends([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFriends();
  }, []);

  if (loading)
    return (
      <p className="text-white text-center mt-4">
        Loading your friends...
      </p>
    );

  if (friends.length === 0)
    return (
      <section className="w-screen bg-black py-12 px-6">

        <h2 className="text-white text-3xl font-semibold mb-6">
          Your Connections
        </h2>
        <p className="text-white text-center">You have no friends yet.</p>
      </section>
    );

  return (
    <section className="w-screen bg-black py-12 px-6 -mx-[calc((100vw-100%)/2)]">
      <h2 className="text-white text-3xl mb-6 font-semibold">
        Your Connections
      </h2>
      <div className="flex flex-col gap-6">
        {friends.map((friend, i) => (
          <motion.div
            key={friend._id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <CardSpotlight className="p-6 !mt-0 !mb-0 cursor-pointer bg-black border border-white/10">
              <div className="flex items-center gap-8 text-white">
                {/* Left: Profile Picture */}
                <div className="flex-shrink-0 w-32 h-40 rounded-xl overflow-hidden border-2 border-white shadow-lg bg-gray-800">
                  <img
                    src={friend.profilePic || "/default-avatar.png"}
                    alt={friend.fullName || friend.username}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Right: Friend Details */}
                <div className="flex-1 flex flex-col justify-center space-y-3">
                  <h3 className="text-2xl font-semibold">
                    {friend.fullName || friend.username}
                  </h3>
                  <p className="text-white/70">@{friend.username}</p>

                  {friend.bio && (
                    <p className="text-sm opacity-70 max-w-lg truncate">
                      {friend.bio}
                    </p>
                  )}

                  <button
                    onClick={() => navigate(`/chat/${friend._id}`)}
                    className="inline-flex items-center px-5 py-2 rounded-full border border-white bg-white text-black hover:bg-transparent hover:text-white transition-colors duration-200 w-max"
                  >
                    Message
                  </button>
                </div>
              </div>
            </CardSpotlight>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default YourFriends;
