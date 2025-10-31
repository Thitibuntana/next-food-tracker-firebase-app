"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { firebasedb } from "@/lib/firebaseConfig";

interface FoodEntry {
  date: string;
  meal_name: string;
  meal_type: string;
  image_url: string | null;
}

export default function EditFoodPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState<FoodEntry>({
    date: "",
    meal_name: "",
    meal_type: "",
    image_url: null,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const docRef = doc(firebasedb, "food", id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data() as FoodEntry;
          setFormData({
            date: data.date,
            meal_name: data.meal_name,
            meal_type: data.meal_type,
            image_url: data.image_url,
          });
          setPreviewImage(data.image_url);
        } else {
          setError("ไม่พบข้อมูลอาหารนี้");
        }
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image") {
      const file = files && files[0] ? files[0] : null;
      setImageFile(file);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreviewImage(formData.image_url);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${id}_${Date.now()}.${fileExt}`;
    const filePath = `foods/${fileName}`;
    const { error: uploadError } = await client.storage.from("food_bk").upload(filePath, file);
    if (uploadError) throw new Error("ไม่สามารถอัปโหลดรูปภาพได้");
    const { data } = supabase.storage.from("food_bk").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.meal_name.trim()) return setError("กรุณากรอกชื่ออาหาร");
    if (!formData.meal_type.trim()) return setError("กรุณาเลือกมื้ออาหาร");
    if (!formData.date) return setError("กรุณาเลือกวันที่");

    setSaving(true);

    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        if (formData.image_url) {
          const filePath = formData.image_url.split("/").slice(-2).join("/");
          await supabase.storage.from("food_bk").remove([filePath]);
        }
        imageUrl = await uploadImage(imageFile);
      }

      const docRef = doc(firebasedb, "food", id!);
      await updateDoc(docRef, {
        foodname: formData.meal_name,
        meal: formData.meal_type,
        fooddate_at: formData.date,
        food_image_url: imageUrl,
        update_at: serverTimestamp(),
      });

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center text-2xl">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white">
      <div className="w-full max-w-lg rounded-xl bg-slate-900 p-8 shadow-2xl">
        <h1 className="mb-6 text-center text-4xl font-bold text-blue-400">แก้ไขอาหาร</h1>
        {error && <div className="mb-4 rounded-lg bg-red-500/20 border border-red-500 p-3 text-red-400 text-center">{error}</div>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="meal_name" className="block text-gray-300">ชื่ออาหาร</label>
            <input type="text" id="meal_name" name="meal_name" value={formData.meal_name} onChange={handleChange} disabled={saving}
              className="mt-1 w-full rounded-md border border-gray-700 bg-slate-800 p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"/>
          </div>

          <div>
            <label htmlFor="meal_type" className="block text-gray-300">มื้ออาหาร</label>
            <select id="meal_type" name="meal_type" value={formData.meal_type} onChange={handleChange} disabled={saving}
              className="mt-1 w-full rounded-md border border-gray-700 bg-slate-800 p-3 text-white focus:border-blue-500 focus:outline-none">
              <option value="" disabled>เลือกประเภทมื้ออาหาร</option>
              <option value="breakfast">อาหารเช้า</option>
              <option value="lunch">อาหารกลางวัน</option>
              <option value="dinner">อาหารเย็น</option>
              <option value="snack">ของว่าง</option>
            </select>
          </div>

          <div>
            <label htmlFor="image" className="block text-gray-300">รูปภาพอาหาร</label>
            <input type="file" id="image" name="image" accept="image/*" onChange={handleChange} disabled={saving}
              className="mt-1 w-full rounded-md border border-gray-700 bg-slate-800 p-3 text-white file:rounded-md file:border-0 file:bg-blue-500 file:text-white"/>
            {previewImage && <div className="mt-4"><img src={previewImage} alt="Food Preview" className="mx-auto h-48 w-48 rounded-xl object-cover shadow-lg"/></div>}
          </div>

          <div>
            <label htmlFor="date" className="block text-gray-300">วันที่</label>
            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} disabled={saving}
              className="mt-1 w-full rounded-md border border-gray-700 bg-slate-800 p-3 text-white focus:border-blue-500 focus:outline-none"/>
          </div>

          <div className="flex justify-between space-x-4">
            <button type="submit" disabled={saving} className="flex-1 rounded-full bg-blue-500 px-8 py-3 font-semibold text-white shadow-lg hover:bg-blue-600">
              {saving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
            </button>
            <button type="button" onClick={() => { setFormData({ ...formData, meal_name: "", meal_type: "", date: "" }); setPreviewImage(formData.image_url); setImageFile(null); setError(null); }} disabled={saving}
              className="flex-1 rounded-full bg-gray-600 px-8 py-3 font-semibold text-white shadow-lg hover:bg-gray-700">
              รีเซ็ต
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
