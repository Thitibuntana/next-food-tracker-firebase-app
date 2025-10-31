"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { firebasedb } from "@/lib/firebaseConfig";
import { client } from "@/lib/supabaseClient";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AddFoodPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<{
    date: string;
    mealName: string;
    mealType: string;
    image: File | null;
  }>({
    date: "",
    mealName: "",
    mealType: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files?.[0] || null;
      setFormData((prev) => ({ ...prev, image: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { date, mealName, mealType, image } = formData;

    if (!date || !mealName || !mealType) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    const user_id = localStorage.getItem("userId");
    if (!user_id) {
      setError("User not found. Please log in again.");
      router.push("/login");
      return;
    }

    try {
      let imageUrl: string | null = null;

      if (image) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${user_id}_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("food_bk")
          .upload(fileName, image);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage
          .from("food_bk")
          .getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }

      await addDoc(collection(firebasedb, "food"), {
        user_id,
        meal_name: mealName,
        meal_type: mealType,
        date,
        image_url: imageUrl,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      alert("Meal added successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex flex-col items-center p-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-4">
          <Link href="/dashboard" className="text-sm text-green-600 hover:underline">
            ← Return to dashboard
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-green-900 mb-6">
          New Entry
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 text-red-700 p-3 text-center border border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border-2 border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Picture of the meal
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border-2 border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-4 w-24 h-24 object-cover rounded-full border border-gray-300"
              />
            )}
          </div>

          <div>
            <label htmlFor="mealName" className="block text-sm font-medium text-gray-700 mb-1">
              Name of the food/meal
            </label>
            <input
              type="text"
              name="mealName"
              value={formData.mealName}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border-2 border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-1">
              What kind of meal is it? (Breakfast, Lunch, Dinner, Snack, etc.)
            </label>
            <input
              type="text"
              name="mealType"
              value={formData.mealType}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border-2 border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-black"
              required
            />
          </div>

          <div className="flex w-full justify-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-8 text-lg font-semibold rounded-xl text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
