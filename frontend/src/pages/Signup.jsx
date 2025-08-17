import { useState } from "react";
import { Link } from "react-router-dom";
import { Vortex } from "../components/ui/vortex";
import useSignUp from "../hooks/useSignUp";

export function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
  });

  const { signup, loading, error } = useSignUp();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(formData);
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <div className="absolute inset-0 -z-10">
        <Vortex
          backgroundColor="black"
          className="flex items-center justify-center w-full h-full"
        />
      </div>

      <div className="z-10 relative flex items-center justify-center h-full">
        <form
          onSubmit={handleSubmit}
          className="shadow-gray-400 bg-black/40 backdrop-blur-md backdrop-saturate-150 text-white p-10 rounded-xl shadow-xs max-w-md w-full space-y-6 z-10"
        >
          <h2 className="text-3xl font-bold text-center">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
              GrindSpace
            </span>
          </h2>

          <p className="text-center text-gray-300 text-lg">" Find. Connect. Grind. "</p>

          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            type="text"
            placeholder="Full name"
            className="w-full px-4 py-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-md font-semibold transition-all disabled:opacity-50"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
          <p className="text-sm text-center text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
