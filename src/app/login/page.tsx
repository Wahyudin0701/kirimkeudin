"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Shield, ArrowLeft } from "lucide-react";
import MeshBackground from "@/components/layout/MeshBackground";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CORRECT_PIN = "0701";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"login" | "pin">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });
  
  // Profile state for PIN screen
  const [profile, setProfile] = useState({ name: "USER", avatar: "" });

  // Fetch profile
  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data) {
          setProfile({
            name: data.name || "USER",
            avatar: data.avatar_url ? `/api/image?url=${encodeURIComponent(data.avatar_url)}` : ""
          });
        }
      })
      .catch(console.error);
  }, []);

  // PIN state
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [sessionTokens, setSessionTokens] = useState<{ access: string; refresh: string } | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
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
        setSessionTokens({
          access: data.session.access_token,
          refresh: data.session.refresh_token,
        });
        setStep("pin");
      }
    } catch (err: any) {
      setError(err.message || "Email atau password salah. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <MeshBackground />

      {/* Decorative blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,197,24,0.18) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(13,45,107,0.12) 0%, transparent 70%)", filter: "blur(50px)" }} />

      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-ku-yellow flex items-center justify-center overflow-hidden shadow-lg flex-shrink-0">
              <img
                src="/Logo_Kirimkeudin.png?v=2"
                alt="Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  (e.currentTarget.parentElement as HTMLElement).innerHTML =
                    '<span style="font-family:Montserrat;font-weight:800;font-size:22px;color:#0D2D6B">K</span>';
                }}
              />
            </div>
            <h1 className="font-montserrat font-extrabold text-2xl text-ku-navy">
              Kirim Ke <span className="text-ku-yellow">Udin</span>
            </h1>
          </div>
          <p className="font-jakarta text-text-muted text-sm">
            {step === "login" ? "Masuk ke ruang digital kamu" : "Verifikasi identitasmu"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === "login" ? (
            /* ── LOGIN FORM ── */
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="glass-card p-7 shadow-glass"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-ku-navy/8 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-ku-navy" />
                </div>
                <h2 className="font-montserrat font-extrabold text-lg text-ku-navy">Masuk</h2>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block font-jakarta font-semibold text-xs text-text-muted mb-1.5 uppercase tracking-wider">
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
                      className="w-full font-jakarta text-sm pl-10 pr-4 py-3 rounded-xl border border-ku-navy/15 bg-white/70 focus:outline-none focus:border-ku-navy focus:ring-2 focus:ring-ku-navy/10 transition-all placeholder:text-text-muted/60"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block font-jakarta font-semibold text-xs text-text-muted mb-1.5 uppercase tracking-wider">
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
                      className="w-full font-jakarta text-sm pl-10 pr-12 py-3 rounded-xl border border-ku-navy/15 bg-white/70 focus:outline-none focus:border-ku-navy focus:ring-2 focus:ring-ku-navy/10 transition-all placeholder:text-text-muted/60"
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
                    className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[10px] font-bold">!</span>
                    </div>
                    <p className="font-jakarta text-sm text-red-600">{error}</p>
                  </motion.div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2.5 bg-ku-navy text-white font-jakarta font-bold text-sm py-3.5 rounded-xl hover:bg-ku-navy/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg mt-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Memverifikasi...
                    </>
                  ) : "Lanjut"}
                </button>
              </form>

              <p className="mt-5 text-center font-jakarta text-xs text-text-muted/70">
                Hanya untuk pemilik website ini 🔒
              </p>
            </motion.div>

          ) : (
            /* ── PIN — Windows Lock Screen Style ── */
            <motion.div
              key="pin"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center"
            >
              {/* Avatar */}
              <motion.div
                className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl mb-4"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                      (e.currentTarget.parentElement as HTMLElement).innerHTML =
                        `<div style="width:100%;height:100%;background:linear-gradient(135deg,#0D2D6B,#1a3f8f);display:flex;align-items:center;justify-content:center;font-family:Montserrat;font-weight:800;font-size:40px;color:#F5C518">${profile.name.charAt(0).toUpperCase()}</div>`;
                    }}
                  />
                ) : (
                  <div style={{
                    width: "100%", height: "100%",
                    background: "linear-gradient(135deg,#0D2D6B,#1a3f8f)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "Montserrat", fontWeight: 800, fontSize: 40, color: "#F5C518"
                  }}>{profile.name.charAt(0).toUpperCase()}</div>
                )}
              </motion.div>

              {/* Name */}
              <motion.p
                className="font-montserrat font-extrabold text-xl text-ku-navy mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                {profile.name}
              </motion.p>

              {/* Windows-style 9-dot icon */}
              <motion.div
                className="grid grid-cols-3 gap-[5px] mb-3 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-ku-navy/40" />
                ))}
              </motion.div>

              {/* Label */}
              <motion.p
                className="font-jakarta text-sm text-text-muted mb-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                Enter your PIN
              </motion.p>

              {/* PIN Input */}
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (pin.length === 4) {
                    if (pin === CORRECT_PIN && sessionTokens) {
                      document.cookie = `sb-access-token=${sessionTokens.access}; path=/; max-age=86400; SameSite=Lax; Secure`;
                      document.cookie = `sb-refresh-token=${sessionTokens.refresh}; path=/; max-age=86400; SameSite=Lax; Secure`;
                      router.push("/dashboard");
                    } else {
                      setPinError(true);
                      setPin("");
                    }
                  }
                }}
                className="w-full max-w-[260px] space-y-3"
              >
                <div className="relative">
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    autoFocus
                    value={pin}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setPin(val);
                      setPinError(false);
                    }}
                    placeholder="PIN"
                    className={`w-full font-jakarta text-sm px-4 py-2.5 rounded-md border-b-2 bg-ku-navy/5 focus:outline-none transition-all placeholder:text-text-muted/60 ${
                      pinError
                        ? "border-red-400 text-red-500"
                        : "border-ku-navy/40 focus:border-ku-navy text-ku-navy"
                    }`}
                  />
                </div>

                {pinError && (
                  <motion.p
                    className="text-center font-jakarta text-xs text-red-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    PIN salah. Coba lagi.
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={pin.length < 4}
                  className="w-full flex items-center justify-center gap-2 bg-ku-navy text-white font-jakarta font-semibold text-sm py-2.5 rounded-md hover:bg-ku-navy/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Masuk
                </button>
              </motion.form>

              <button
                onClick={() => { setStep("login"); setPin(""); setPinError(false); }}
                className="mt-5 font-jakarta text-xs text-text-muted hover:text-ku-navy transition-colors"
              >
                Kembali Ke Login
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-5 text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 font-jakarta text-sm text-text-muted hover:text-ku-navy transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke beranda
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
