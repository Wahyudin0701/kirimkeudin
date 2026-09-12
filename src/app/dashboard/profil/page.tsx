"use client";

import { useState, useEffect } from "react";
import { User, Lock, Mail, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    name: "Wahyudin",
    email: "kirimkeudin@gmail.com",
    password: "",
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.name) {
          setForm((f) => ({ ...f, name: data.name, email: data.email || f.email }));
          if (data.avatar_url) {
            setAvatarPreview(`/api/image?url=${encodeURIComponent(data.avatar_url)}`);
          }
        }
        setInitialLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setInitialLoading(false);
      });
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    
    try {
      let avatar_url;

      // 1. Upload avatar jika ada file baru
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        
        if (!uploadRes.ok) throw new Error("Gagal mengunggah foto");
        const uploadData = await uploadRes.json();
        avatar_url = uploadData.fileUrl;
      }

      // 2. Simpan settings
      const payload: any = { name: form.name };
      if (avatar_url) payload.avatar_url = avatar_url;

      const saveRes = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!saveRes.ok) throw new Error("Gagal menyimpan profil");

      setForm((f) => ({ ...f, password: "" }));
      router.refresh();
      router.push("/dashboard?success=profile_updated");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-ku-navy" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-[calc(100vh-100px)] w-full">
      <div className="mb-6 md:mb-8 text-center md:text-left">
        <h1 className="font-montserrat font-extrabold text-2xl md:text-3xl text-ku-navy">Profil Saya</h1>
        <p className="font-jakarta text-xs md:text-sm text-text-muted mt-1">
          Kelola informasi akun dan kata sandi kamu
        </p>
      </div>

      <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-black/5 shadow-card relative overflow-hidden">
        {/* Dekorasi kecil */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-ku-navy/5 rounded-bl-[100px] pointer-events-none" />

        <div className="flex flex-col items-center justify-center gap-4 md:gap-5 mb-8 pb-8 border-b border-gray-100 relative text-center">
          <div className="relative group">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-ku-yellow flex items-center justify-center flex-shrink-0 overflow-hidden border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-105">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-montserrat font-extrabold text-4xl md:text-5xl text-ku-navy">
                  {form.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {/* Overlay Upload */}
            <label className="absolute inset-0 bg-black/40 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <User className="w-6 h-6 mb-1" />
              <span className="text-xs font-jakarta font-semibold">Ubah Foto</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
          <div>
            <h2 className="font-montserrat font-extrabold text-xl md:text-2xl text-ku-navy">{form.name}</h2>
            <p className="font-jakarta text-xs md:text-sm text-text-muted flex items-center justify-center gap-1.5 mt-1.5">
              <Mail className="w-4 h-4" /> {form.email}
            </p>
            <span className="inline-block mt-3 font-jakarta text-[10px] md:text-xs font-bold px-3 py-1.5 bg-ku-navy/10 text-ku-navy rounded-lg">
              Administrator
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6 relative w-full">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div>
              <label className="block font-jakarta font-semibold text-xs md:text-sm text-ku-navy mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-ku-navy/50" /> Nama Lengkap
              </label>
              <input 
                required 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full font-jakarta text-sm px-4 py-3 rounded-xl border border-ku-navy/15 bg-ku-bg focus:outline-none focus:border-ku-navy focus:ring-2 focus:ring-ku-navy/10 transition-all"
              />
            </div>

            <div>
              <label className="block font-jakarta font-semibold text-xs md:text-sm text-ku-navy mb-1.5 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-ku-navy/50" /> Alamat Email
              </label>
              <input 
                required 
                type="email"
                disabled
                value={form.email} 
                className="w-full font-jakarta text-sm px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-text-muted cursor-not-allowed"
                title="Email tidak dapat diubah dari sini"
              />
              <p className="font-jakarta text-[10px] text-text-muted mt-1.5 ml-1">
                * Email terhubung dengan sistem login, ubah melalui dashboard Supabase jika diperlukan.
              </p>
            </div>
          </div>

          <div>
            <label className="block font-jakarta font-semibold text-xs md:text-sm text-ku-navy mb-1.5 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-ku-navy/50" /> Kata Sandi Baru
            </label>
            <input 
              type="password"
              value={form.password} 
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Kosongkan jika tidak ingin mengubah sandi"
              className="w-full font-jakarta text-sm px-4 py-3 rounded-xl border border-ku-navy/15 bg-ku-bg focus:outline-none focus:border-ku-navy focus:ring-2 focus:ring-ku-navy/10 transition-all"
            />
          </div>

          {successMsg && (
            <div className="font-jakarta font-semibold text-xs md:text-sm text-green-700 bg-green-50 border border-green-200 px-4 py-3 rounded-xl">
              {successMsg}
            </div>
          )}

          <div className="pt-4 flex justify-center md:justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto flex items-center justify-center gap-2 font-jakarta font-bold text-xs md:text-sm px-8 py-3.5 rounded-xl bg-ku-navy text-white hover:bg-ku-navy-light disabled:opacity-60 transition-all shadow-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
