"use client";

import { useState } from "react";
import Image from "next/image";
import food01 from "./images/food01.jpg";

export default function Home() {
  const [isHoveredLogin, setIsHoveredLogin] = useState(false);
  const [isHoveredRegister, setIsHoveredRegister] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-6 text-center">
        {/* Main Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-green-900 leading-tight">
          Welcome to Food Tracker
        </h1>

        {/* Subtext */}
        <p className="text-xl md:text-2xl text-green-800">
          Track your everyday meal.
        </p>

        {/* Image - A generic food-related placeholder */}
        <div className="w-full max-w-sm md:max-w-md lg:max-w-lg rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105">
          <Image
            src={food01}
            alt="Generic food placeholder"
            width={550}
            height={550}
          />
        </div>

        {/* Buttons in a horizontal axis */}
        <div className="flex flex-row items-center space-x-4 w-full max-w-xs justify-center">
          {/* Register Button */}
          <a
            href="/register"
            className={`w-full py-3 px-8 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 transform border-2 border-green-400
              ${isHoveredRegister ? "bg-green-700 scale-105" : "bg-green-600"}
              text-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2`}
            onMouseEnter={() => setIsHoveredRegister(true)}
            onMouseLeave={() => setIsHoveredRegister(false)}
          >
            Register
          </a>

          {/* Login Button */}
          <a
            href="/login"
            className={`w-full py-3 px-8 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 transform border-2 border-green-400
              ${isHoveredLogin ? "bg-green-700 scale-105" : "bg-green-600"}
              text-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2`}
            onMouseEnter={() => setIsHoveredLogin(true)}
            onMouseLeave={() => setIsHoveredLogin(false)}
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
