import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Vortex } from "../components/ui/vortex";
import useLogin from "../hooks/useLogin";

export function Login() {
  const navigate = useNavigate();
  const { error, isPending, loginMutation } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // If there's an API error, show a toast
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to log in");
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(
      { email, password },
      {
        onSuccess: () => {
          navigate("/"); // Redirect to home page
        },
      }
    );
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

          <p className="text-center text-gray-300 text-lg">
            " Find. Connect. Grind. "
          </p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-md font-semibold transition-all disabled:opacity-50"
          >
            {isPending ? "Logging in..." : "Log in"}
          </button>

          <p className="text-sm text-center text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
