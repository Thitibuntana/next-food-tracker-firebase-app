"use client";

import { useState } from "react";
import Image from "next/image"

export default function ProfilePage() {
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    gender: string;
    image: File | null;
  }>({
    fullName: "Jane Doe",
    email: "jane.doe@example.com",
    gender: "female",
    image: null,
  });

  // Handles text and radio input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handles image file input separately
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Profile data updated:", formData);
    // Send to backend here in real application
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex flex-col items-center p-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg">
        {/* Link to return to dashboard */}
        <div className="text-center mb-4">
          <a
            href="/dashboard"
            className="text-sm text-green-600 hover:underline"
          >
            ← Return to dashboard
          </a>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-green-900 mb-6">
          Edit Profile
        </h1>

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-500 shadow-md">
            <Image
              src={
                formData.image
                  ? URL.createObjectURL(formData.image)
                  : "https://placehold.co/128x128/e5e7eb/525252?text=Profile"
              }
              alt="Profile"
              width={128}
              height={128}
              className="object-cover"
              unoptimized // Needed for blob URLs or non-remote images
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="image"
              className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-600 transition-colors duration-200"
            >
              Change Profile Picture
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name Input */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border-2 border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors duration-300 text-black"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border-2 border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors duration-300 text-black"
              required
            />
          </div>

          {/* Gender Radio */}
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </span>
            <div className="mt-2 flex space-x-4">
              {["male", "female", "other"].map((genderOption) => (
                <label className="inline-flex items-center" key={genderOption}>
                  <input
                    type="radio"
                    className="form-radio text-green-600 focus:ring-green-600"
                    name="gender"
                    value={genderOption}
                    checked={formData.gender === genderOption}
                    onChange={handleChange}
                  />
                  <span className="ml-2 text-gray-700 capitalize">
                    {genderOption}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex w-full justify-center mt-6">
            <button
              type="submit"
              className="w-full py-3 px-8 text-lg font-semibold rounded-xl text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
