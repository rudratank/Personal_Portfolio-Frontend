import React, { useState, useEffect } from "react";
import login from '../../assets/Login.jpeg';
import axios from "axios";
import { toast } from "sonner";
import { userAppStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { LOGIN_ROUTE } from "@/lib/constant.js";


function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUserInfo } = userAppStore();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [unlockCode, setUnlockCode] = useState(""); 
  const [showUnlockForm, setShowUnlockForm] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0); // Track login attempts
  const navigate = useNavigate();

  useEffect(() => {}, [showOtpForm, showUnlockForm]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    const data = { email: email.trim(), password: password };
    setLoading(true);
    
    try {
      const response = await axios.post(LOGIN_ROUTE, data, {
        withCredentials: true,
      });

      if (response.data.otpRequired) {
        setShowOtpForm(true);
        setLoading(false);
        toast.success("OTP has been sent to your email!");
        return;
      }

      setUserInfo(response.data.user);
      navigate("/admin-dashboard");
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
      setLoginAttempts(prevAttempts => prevAttempts + 1); // Increment the login attempt counter
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${LOGIN_ROUTE}`,
        { email: email.trim(), otp: otp.toString() },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Login successful!");
        setUserInfo(response.data.user);
        navigate("/admin-dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (e) => {
    e.preventDefault();

    if (!email || !unlockCode) {
      toast.error("Please enter your email and unlock code");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${LOGIN_ROUTE}/unlock-account`, {
        email: email.trim(),
        unlockCode: unlockCode.trim(),
      });

      toast.success(response.data.message);
      setShowUnlockForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to unlock account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-500 to-teal-400">
      <div className="bg-white rounded-lg shadow-lg flex w-full max-w-5xl overflow-hidden">
        <div className="flex-1 bg-gray-100 flex justify-center items-center p-0 m-0">
          <img src={login} alt="Login Illustration" className="h-full w-full object-cover" />
        </div>

        <div className="flex-1 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {showOtpForm ? "Enter OTP" : showUnlockForm ? "Unlock Account" : "Login as an Admin User"}
          </h2>

          {!showOtpForm && !showUnlockForm ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="johndoe@xyz.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="absolute top-3 right-4 text-gray-400">👤</span>
              </div>

              <div className="relative">
                <input
                  type="password"
                  placeholder="********"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="absolute top-3 right-4 text-gray-400">🔒</span>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition"
                disabled={loading}
              >
                {loading ? "Please wait..." : "LOGIN"}
              </button>
              {loginAttempts >= 3 && (
                <button
                  type="button"
                  onClick={() => setShowUnlockForm(true)}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold transition"
                >
                  Unlock Account
                </button>
              )}
            </form>
          ) : showOtpForm ? (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition"
                disabled={loading}
              >
                {loading ? "Verifying..." : "VERIFY OTP"}
              </button>
              <button
                type="button"
                onClick={() => setShowOtpForm(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold transition"
              >
                Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="johndoe@xyz.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter Unlock Code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={unlockCode}
                  onChange={(e) => setUnlockCode(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition"
                disabled={loading}
              >
                {loading ? "Unlocking..." : "UNLOCK"}
              </button>
              <button
                type="button"
                onClick={() => setShowUnlockForm(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold transition"
              >
                Back to Login
              </button>
            </form>
          )}

          <div className="mt-4 text-sm text-gray-500">
            <a href="/help-signin" className="hover:text-purple-500">
              Get help Signing in.
            </a>
          </div>
          <div className="space-x-2">
          <a href="/privacy" className="text-purple-500 hover:underline">
            Terms of use.
            </a>
            <a href="/terms-of-service" className="text-purple-500 hover:underline">
              Privacy policy
          </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
