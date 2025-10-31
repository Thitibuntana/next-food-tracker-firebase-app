"use client";

import { useState } from "react";

export default function EditFoodPage() {
  // In a real application, you would fetch the entry data based on an ID from the URL.
  // This is mock data to simulate an existing entry being edited.
  type FoodEntry = {
    date: string;
    mealName: string;
    mealType: string;
    image: File | null;
  };

  const mockEntry: FoodEntry = {
    date: "2023-10-27",
    mealName: "Grilled Chicken Salad",
    mealType: "Lunch",
    image: null,
  };

  const [formData, setFormData] = useState<FoodEntry>(mockEntry);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({
        ...formData,
        [name]: files && files[0] ? files[0] : null,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Edited data submitted:", formData);
    // In a real app, you would send this data to a backend or database to update the entry
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
          Edit Entry
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Input */}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border-2 border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors duration-300 text-black"
              required
            />
          </div>

          {/* Picture Input */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Picture of the meal
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border-2 border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors duration-300"
            />
            {formData.image && (
              <p className="mt-2 text-sm text-gray-500">
                File selected: {formData.image.name}
              </p>
            )}
          </div>

          {/* Meal Name Input */}
          <div>
            <label
              htmlFor="mealName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name of the food/meal
            </label>
            <input
              type="text"
              id="mealName"
              name="mealName"
              value={formData.mealName}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border-2 border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors duration-300 text-black"
              required
            />
          </div>

          {/* Meal Type Input */}
          <div>
            <label
              htmlFor="mealType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Which meal is it? (Breakfast, Lunch, Dinner, etc.)
            </label>
            <input
              type="text"
              id="mealType"
              name="mealType"
              value={formData.mealType}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border-2 border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors duration-300 text-black"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex w-full justify-center mt-6">
            <button
              type="submit"
              className="w-full py-3 px-8 text-lg font-semibold rounded-xl text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
