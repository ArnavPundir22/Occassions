"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: isHost ? "HOST" : "ATTENDEE",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
      } else {
        toast.success("Registration successful! Please login.");
        router.push("/login");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[85vh] items-center justify-center px-4 overflow-hidden">
      <div className="absolute left-[-150px] top-[20%] h-[350px] w-[350px] rounded-full bg-indigo-500/20 blur-[120px]" />

      <div className="absolute right-[-150px] bottom-[10%] h-[350px] w-[350px] rounded-full bg-violet-500/20 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{
          boxShadow: "0 0 60px rgba(99,102,241,0.15)",
        }}
        className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
      >
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500" />

        <div className="p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">Create an Account</h1>

            <p className="mt-3 text-sm text-zinc-400">Sign up to get started</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-zinc-300">
                Full Name
              </label>

              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="
              mt-2
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/5
              px-4
              py-3
              text-white
              placeholder:text-zinc-500
              outline-none
              transition-all
              focus:border-indigo-500/50
              focus:ring-2
              focus:ring-indigo-500/20
              "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300">
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="
              mt-2
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/5
              px-4
              py-3
              text-white
              placeholder:text-zinc-500
              outline-none
              transition-all
              focus:border-indigo-500/50
              focus:ring-2
              focus:ring-indigo-500/20
              "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300">
                Password
              </label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-4
                py-3
                pr-12
                text-white
                placeholder:text-zinc-500
                outline-none
                transition-all
                focus:border-indigo-500/50
                focus:ring-2
                focus:ring-indigo-500/20
                "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isHost"
                checked={isHost}
                onChange={(e) => setIsHost(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5"
              />

              <label htmlFor="isHost" className="text-sm text-zinc-300">
                I am a Host (Create Events)
              </label>
            </div>

            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="
            w-full
            rounded-xl
            bg-gradient-to-r
            from-indigo-500
            to-violet-500
            px-6
            py-3
            text-sm
            font-medium
            text-white
            shadow-lg
            shadow-indigo-500/20
            transition-all
            disabled:opacity-50
            "
            >
              {loading ? "Creating account..." : "Sign Up"}
            </motion.button>
          </form>

          <p className="text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
