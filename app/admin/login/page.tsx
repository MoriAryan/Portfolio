"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid credentials. Please try again.");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] flex items-center justify-center px-4 selection:bg-[#e11d2a]/30">
      <div className="w-full max-w-sm">
        <div className="bg-[#0e0e14] border border-slate-800 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(225,29,42,0.12)]">
          {/* Brand Logo in Login Header */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative w-12 h-12 mb-3">
              <Image
                src="/logo.png"
                alt="Mori Aryan"
                fill
                priority
                className="object-contain filter drop-shadow-[0_0_12px_rgba(225,29,42,0.5)]"
              />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide font-mono">
              Admin Console
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Authorized access only
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-username"
                className="block text-xs font-mono font-medium text-slate-400 mb-1.5"
              >
                Username
              </label>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#14141d] border border-slate-800 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#e11d2a] focus:border-[#e11d2a] transition-all text-sm"
                placeholder="admin"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-mono font-medium text-slate-400 mb-1.5"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#14141d] border border-slate-800 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#e11d2a] focus:border-[#e11d2a] transition-all text-sm"
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 font-mono">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#e11d2a] hover:bg-[#ff2a3b] disabled:opacity-50 text-white font-semibold rounded-lg transition-all shadow-[0_0_20px_rgba(225,29,42,0.4)] text-sm cursor-pointer"
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-slate-600 text-xs font-mono text-center mt-5">
          NOINDEX // RESTRICTED ACCESS
        </p>
      </div>
    </div>
  );
}
