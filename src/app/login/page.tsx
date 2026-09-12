"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import MeshBackground from "@/components/layout/MeshBackground";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (signInError) throw signInError;

      if (data.session) {
        // Simpan token di cookie agar bisa dibaca oleh Middleware (Masa aktif 1 hari)
        document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=86400; SameSite=Lax; Secure`;
        document.cookie = `sb-refresh-token=${data.session.refresh_token}; path=/; max-age=86400; SameSite=Lax; Secure`;
        
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Email atau password salah. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6">
      <MeshBackground />

      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-montserrat font-extrabold text-3xl text-ku-navy mb-1">
            Kirim Ke Udin
          </h1>
          <p className="font-jakarta text-text-muted text-sm">
            Masuk ke ruang digital kamu
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 shadow-glass">
          <h2 className="font-montserrat font-extrabold text-xl text-ku-navy mb-7">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block font-jakarta font-semibold text-sm text-ku-navy mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="email@kamu.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full font-jakarta text-sm pl-10 pr-4 py-3 rounded-xl border border-ku-navy/15 bg-white/60 focus:outline-none focus:border-ku-navy focus:ring-2 focus:ring-ku-navy/10 transition-all placeholder:text-text-muted"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-jakarta font-semibold text-sm text-ku-navy mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full font-jakarta text-sm pl-10 pr-12 py-3 rounded-xl border border-ku-navy/15 bg-white/60 focus:outline-none focus:border-ku-navy focus:ring-2 focus:ring-ku-navy/10 transition-all placeholder:text-text-muted"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-ku-navy transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                className="flex items-center gap-2 p-3.5 rounded-xl bg-ku-red/10 border border-ku-red/20"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <svg className="w-4 h-4 text-ku-red flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p className="font-jakarta text-sm text-ku-red">{error}</p>
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-ku-navy text-white font-jakarta font-bold text-base py-3.5 rounded-xl hover:bg-ku-navy-light disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glass-sm mt-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Masuk...
                </>
              ) : "Masuk ke Dashboard"}
            </button>
          </form>

          <p className="mt-6 text-center font-jakarta text-xs text-text-muted">
            Tidak ada akun publik — hanya untuk pemilik website.
          </p>
        </div>

        <p className="mt-6 text-center">
          <a href="/" className="font-jakarta text-sm text-text-muted hover:text-ku-navy transition-colors">
            ← Kembali ke beranda
          </a>
        </p>
      </motion.div>
    </div>
  );
}
