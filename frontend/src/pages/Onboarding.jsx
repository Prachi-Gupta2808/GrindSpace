"use client";

import { Vortex } from "@/components/ui/vortex";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import useAuthUser from "@/hooks/useAuthUser";
import { completeOnboarding } from "@/lib/api";

const INTEREST_OPTIONS = [
  "DSA", "CP", "UI/UX", "Figma", "Flutter",
  "React", "App Dev", "Web Dev", "AI/ML", "Blockchain", "Cybersecurity", "Game Dev"
];

const Onboarding = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    bio: authUser?.bio || "",
    location: authUser?.location || "",
    primaryInterests: authUser?.primaryInterests || [],
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const storedPic = localStorage.getItem("profilePic");
    if (storedPic) {
      setProfilePic(storedPic);
    }
  }, []);

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      console.log(error?.response?.data?.message || "Something went wrong.");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      primaryInterests: prev.primaryInterests.includes(interest)
        ? prev.primaryInterests.filter((i) => i !== interest)
        : [...prev.primaryInterests, interest],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = { ...formData, profilePic };
    onboardingMutation(finalData);
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <div className="absolute inset-0 -z-10">
        <Vortex backgroundColor="black" className="flex items-center justify-center w-full h-full" />
      </div>

      <div className="z-10 relative flex flex-col md:flex-row items-center justify-center h-full px-6 gap-8">
        {/* Profile Picture Section */}
        <div className="flex-shrink-0 w-full max-w-xs flex flex-col items-center justify-center">
          <div className="relative overflow-hidden rounded-xl h-[30rem] w-full shadow-lg opacity-95">
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="object-cover absolute inset-0 w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 text-white flex items-center justify-center text-center text-sm">
                No Profile Picture Selected
              </div>
            )}
          </div>
          <p className="text-white text-center mt-4">Great choice <span className="text-white">🤍</span></p>
        </div>

        {/* Onboarding Form */}
        <form
          onSubmit={handleSubmit}
          className="shadow-gray-400 bg-black/50 backdrop-blur-md backdrop-saturate-150 text-white p-10 rounded-xl shadow-xs max-w-md w-full space-y-6"
        >
          <h2 className="text-3xl font-bold text-center">
            Let's get you{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
              Onboarded
            </span>
          </h2>

          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Write a short bio about yourself"
            rows={3}
            className="w-full px-4 py-2 rounded-md bg-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />

          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              type="text"
              placeholder="City, Country"
              className="flex-1 px-4 py-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4 md:mb-0"
              required
            />

            <div className="relative w-full md:w-fit">
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 px-4 py-2 rounded-md text-white font-semibold hover:bg-blue-700 w-full"
              >
                Add Interests!!
              </button>

              {showDropdown && (
                <div
                  className="absolute top-12 left-1/2 md:left-0 md:translate-x-0 -translate-x-1/2 w-60 max-h-60 overflow-y-auto bg-gray-800 border border-gray-600 rounded-md mt-2 z-50"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {INTEREST_OPTIONS.map((option, i) => {
                    const isSelected = formData.primaryInterests.includes(option);
                    return (
                      <div
                        key={i}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-700 ${
                          isSelected ? "bg-purple-700 text-white font-semibold" : "text-white"
                        }`}
                        onClick={() => handleToggleInterest(option)}
                      >
                        {option}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-md font-semibold transition-all"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
