import React, { useState } from "react";
import VirtualKeyboard from "../components/Login/VirtualKeyboard";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeField, setActiveField] = useState<
    "username" | "password" | null
  >(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Login functionality not yet implemented.");
  };

  const googleLogin = () => {
    window.location.href =
      "http://localhost:8000/auth/login/google-oauth2/";
  };

  const handleKeyboardChange = (value: string) => {
    if (activeField === "username") setUsername(value);
    if (activeField === "password") setPassword(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 text-white relative overflow-hidden">
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl px-8 py-10 flex flex-col items-center">
          <h2 className="text-3xl font-extrabold mb-6">
            🔐 Login to XPLOR
          </h2>

          {message && (
            <div className="w-full mb-4 bg-red-500/20 text-red-200 px-4 py-2 rounded-lg text-center">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
                value={username}
                onFocus={() => {
                  setActiveField("username");
                  setShowKeyboard(true);
                }}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
                value={password}
                onFocus={() => {
                  setActiveField("password");
                  setShowKeyboard(true);
                }}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 font-bold shadow-lg hover:scale-105 transition"
            >
              Login
            </button>
          </form>

          <button
            onClick={googleLogin}
            className="w-full mt-4 py-3 rounded-xl border border-blue-400 text-blue-200 hover:bg-blue-600 hover:text-white transition"
          >
            Login with Google
          </button>

          {/* Toggle keyboard */}
          <button
            type="button"
            onClick={() => setShowKeyboard((v) => !v)}
            className="mt-4 text-sm underline"
          >
            {showKeyboard ? "Hide Keyboard" : "Show Virtual Keyboard"}
          </button>

          {/* Virtual Keyboard */}
          {showKeyboard && (
            <VirtualKeyboard
              value={
                activeField === "username"
                  ? username
                  : password
              }
              onChange={handleKeyboardChange}
            />
          )}

          <small className="mt-4 text-gray-300">
            Don&apos;t have an account? Contact admin.
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
