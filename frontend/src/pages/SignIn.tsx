import React, { useState } from "react";
import googleIcon from "../assets/Google_Icon.png";
import appleIcon from "../assets/Apple_Icon.png";
import { useAuth } from "../context/AuthContext";

interface SignInProps {
  onBack?: () => void;
  onGoogleSignIn?: () => void;
  onAppleSignIn?: () => void;
  onSignUp?: () => void;
}

const SignIn: React.FC<SignInProps> = ({
  onBack,
  onGoogleSignIn,
  onAppleSignIn,
  onSignUp,
}) => {
  const { signIn, error, clearError, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const validate = (): boolean => {
    if (!email.trim()) { setLocalError("Email is required"); return false }
    if (!password) { setLocalError("Password is required"); return false }
    return true;
  };

  const handleSubmit = async () => {
    clearError();
    setLocalError(null);
    if (!validate()) return;
    try {
      await signIn(email.trim(), password);
    } catch {
      // error is set by context
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const displayError = localError ?? error;

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] flex items-center justify-center overflow-hidden relative">
      <button
        className="absolute top-10 left-10 w-[91px] h-[31px] bg-white border border-[#0f172a] rounded-md font-['Baloo_Bhai_2'] text-base text-[#0f172a] cursor-pointer flex items-center justify-center gap-1 transition-colors duration-150 hover:bg-[#f1f5f9]"
        onClick={onBack}
        type="button"
      >
        ← Back
      </button>

      <div className="flex flex-col items-center gap-4 w-full max-w-[560px] relative z-10">
        <h1 className="font-['Baloo_Bhai_2'] font-bold text-4xl sm:text-5xl lg:text-6xl text-[#0f172a] leading-tight text-center">
          Let's sign you in
        </h1>
        <p className="font-['Baloo_Bhai_2'] font-bold text-2xl text-[#64748b] text-center -mt-1 mb-2">
          Welcome back!
        </p>

        {displayError && <p className="text-red-500 text-sm text-center mb-2">{displayError}</p>}

        <input
          className="w-full max-w-md h-14 bg-white border border-[#0f172a] rounded-lg px-5 font-['Baloo_Bhai_2'] text-2xl text-[#0f172a]/60 outline-none transition-all duration-200 focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] focus:text-[#0f172a] placeholder:text-[#0f172a]/60"
          type="email"
          name="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="email"
          disabled={isLoading}
        />

        <input
          className="w-full max-w-md h-14 bg-white border border-[#0f172a] rounded-lg px-5 font-['Baloo_Bhai_2'] text-2xl text-[#0f172a]/60 outline-none transition-all duration-200 focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] focus:text-[#0f172a] placeholder:text-[#0f172a]/60"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="current-password"
          disabled={isLoading}
        />

        <button
          className="w-full max-w-md h-14 bg-[#3b82f6] border-2 border-[#0f172a] rounded-lg font-['Baloo_Bhai_2'] text-3xl font-semibold text-[#0f172a] cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-[#2563eb] hover:-translate-y-px active:bg-[#1d4ed8] active:translate-y-0 disabled:opacity-50"
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        <div className="flex flex-col items-center gap-0.5">
          <span className="font-['Baloo_Bhai_2'] text-2xl text-[#0f172a]">Forgot Password?</span>
        </div>

        <div className="w-full max-w-md flex items-center gap-3">
          <div className="w-[218px] h-px bg-[#0f172a]/10 flex-none" />
          <span className="font-['Baloo_Bhai_2'] text-base text-[#0f172a] whitespace-nowrap">or</span>
          <div className="w-[218px] h-px bg-[#0f172a]/10 flex-none" />
        </div>

        <button
          className="w-full max-w-md h-14 border border-[#0f172a] rounded-lg font-['Baloo_Bhai_2'] text-2xl font-semibold text-[#0f172a] cursor-pointer flex items-center justify-center gap-3 transition-all duration-200 hover:opacity-85 hover:-translate-y-px active:translate-y-0 bg-[#a78bfa] disabled:opacity-50"
          type="button"
          onClick={onGoogleSignIn}
          disabled={isLoading}
        >
          <img src={googleIcon} alt="Google" className="w-7 h-7 mix-blend-multiply" />
          Sign in with Google
        </button>

        <button
          className="w-full max-w-md h-14 border border-[#0f172a] rounded-lg font-['Baloo_Bhai_2'] text-2xl font-semibold text-[#0f172a] cursor-pointer flex items-center justify-center gap-3 transition-all duration-200 hover:opacity-85 hover:-translate-y-px active:translate-y-0 bg-[#3b82f6] disabled:opacity-50"
          type="button"
          onClick={onAppleSignIn}
          disabled={isLoading}
        >
          <img src={appleIcon} alt="Apple" className="w-7 h-7 mix-blend-multiply" />
          Sign in with Apple
        </button>

        <div className="flex flex-col items-center gap-0.5">
          <span className="font-['Baloo_Bhai_2'] text-2xl text-[#0f172a]">Are you a new user?</span>
          <button
            className="font-['Baloo_Bhai_2'] text-2xl text-[#0f172a] underline cursor-pointer bg-none border-none p-0 transition-colors duration-150 hover:text-[#3b82f6]"
            type="button"
            onClick={onSignUp}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;