"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";
import { firebasedb } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const alertStyled = (message: string, success: boolean) => {
    if (typeof window === "undefined") return;
    const color = success ? "bg-green-600" : "bg-red-600";
    const div = document.createElement("div");
    div.className = `fixed inset-0 flex items-center justify-center z-50`;
    div.innerHTML = `
      <div class='${color} text-white px-10 py-6 rounded-lg shadow-lg text-center space-y-4'>
        <p class='text-lg font-semibold'>${message}</p>
        <button id='okBtn' class='bg-white text-black px-4 py-2 rounded font-semibold hover:bg-gray-200 transition'>OK</button>
      </div>
    `;
    document.body.appendChild(div);
    document.getElementById("okBtn")?.addEventListener("click", () => div.remove());
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    if (id === "email") setEmail(value);
    if (id === "password") setPassword(value);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alertStyled("Please enter email and password", false);
      return;
    }

    try {
      setLoading(true);

      const q = query(collection(firebasedb, "user"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alertStyled("No account found with this email", false);
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const storedHash = userData.password as string;

      const isMatch = await bcrypt.compare(password, storedHash);
      if (!isMatch) {
        alertStyled("Incorrect password", false);
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("userId", userDoc.id);
      }

      alertStyled("Login successful!", true);

      setTimeout(() => router.push("/dashboard"), 800);
    } catch (error) {
      console.error("Login error:", error);
      alertStyled("An error occurred while logging in", false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl">
        <h1 className="mb-6 text-center text-4xl font-bold text-green-700">Login</h1>
        <p className="mb-8 text-center text-gray-500">Welcome back!</p>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div>
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? "👁️" : "🔒"}
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-green-600 px-8 py-3 font-semibold text-white shadow-lg hover:bg-green-700 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-gray-500">
          Don&apos;t have an account?{" "}
          <a href="/register" className="font-semibold text-green-600 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
}
