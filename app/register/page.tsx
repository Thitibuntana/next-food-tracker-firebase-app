"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { firebasedb } from "@/lib/firebaseConfig";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  const handleReset = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setGender("");
    setProfileImage(null);
    setPreviewImage(null);
    const fileInput = document.getElementById("profileImage") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setProfileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else setPreviewImage(null);
  };

  const handleSubmit = async () => {
    if (!fullName || !email || !password || !gender) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const q = query(collection(firebasedb, "user"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        alert("This email is already in use.");
        setLoading(false);
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      let imageUrl = "";
      if (profileImage) {
        const fileName = `${Date.now()}_${profileImage.name}`;
        const { error: uploadError } = await supabase.storage
          .from("user_bk")
          .upload(fileName, profileImage);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("user_bk").getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }

      await addDoc(collection(firebasedb, "user"), {
        full_name: fullName,
        email,
        password: hashedPassword,
        gender,
        image_url: imageUrl,
        create_at: new Date(),
        update_at: new Date(),
      });

      alert("Registration successful!");
      router.push("/login");
    } catch (err: unknown) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 text-white">
      <div className="w-full max-w-lg rounded-xl bg-slate-900 p-8 shadow-2xl">
        <h1 className="text-center text-4xl font-bold text-blue-400 mb-6">Register</h1>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full p-3 rounded bg-slate-800 text-white" />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 rounded bg-slate-800 text-white" />
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 pr-12 rounded bg-slate-800 text-white" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">👁</button>
          </div>

          <div className="flex space-x-4">
            {["Male", "Female", "Other"].map(g => (
              <label key={g}>
                <input type="radio" name="gender" value={g} checked={gender === g} onChange={e => setGender(e.target.value)} /> {g}
              </label>
            ))}
          </div>

          <div>
            <input type="file" accept="image/*" onChange={handleFileChange} id="profileImage" />
            {previewImage && <img src={previewImage as string} className="w-32 h-32 rounded-full mt-2" />}
          </div>

          <div className="flex space-x-4">
            <button type="submit" className="bg-blue-500 px-6 py-3 rounded w-full">{loading ? "Loading..." : "Register"}</button>
            <button type="button" onClick={handleReset} className="bg-gray-700 px-6 py-3 rounded w-full">Reset</button>
          </div>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account? <Link href="/login" className="text-blue-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
