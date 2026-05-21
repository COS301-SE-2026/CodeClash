import React, { useState } from "react";
import googleIcon from "../assets/Google_Icon.png";
import appleIcon from "../assets/Apple_Icon.png";
import { useAuth } from "../context/AuthContext";

interface SignInProps {
  onBack: () => void;
  onGoogleSignIn?: () => void;
  onAppleSignIn?: () => void;
  onSignUp: () => void;
  onSignIn: () => void;
}

const SignIn: React.FC<SignInProps> = ({
  onBack,
  onGoogleSignIn,
  onAppleSignIn,
  onSignUp,
  onSignIn,
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
      onSignIn();
    } catch {
      // error is set by context
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const displayError = localError ?? error;

  return (
    <div className="w-full min-h-screen bg-[#d2d2d2] flex items-center justify-center overflow-hidden relative">
      <button
        className="absolute top-10 left-10 w-[91px] h-[31px] bg-[#5f5980] rounded-[20px] font-['Baloo_Bhai_2'] text-base font-normal text-white cursor-pointer flex items-center justify-center gap-1 transition-colors duration-150 hover:bg-[#5F5980]"
        onClick={onBack}
        type="button"
      >
        ← Back
      </button>

      <div className="flex flex-col items-center gap-4 w-full max-w-[560px] relative z-10">
        <h1 className="font-['Baloo_Bhai_2'] font-bold text-[2.5rem] sm:text-[3rem] lg:text-[4rem] text-[#0f172a] leading-[1.1] text-center">
          Let's sign you in
        </h1>
        <p className="font-['Baloo_Bhai_2'] font-bold text-[1.5rem] sm:text-[2rem] text-[#64748b] text-center -mt-1 mb-2">
          Welcome back!
        </p>

        {displayError && <p className="text-red-500 text-sm text-center mb-2">{displayError}</p>}

        <input
          className="w-[500px] max-w-[90vw] h-[60px] bg-white border-[0.5px] border-[#0f172a] rounded-[20px] px-5 font-['Baloo_Bhai_2'] text-2xl font-normal text-[#0f172a]/60 outline-none transition-all duration-200 focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] focus:text-[#0f172a] placeholder:text-[#0f172a]/60"
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
          className="w-[500px] max-w-[90vw] h-[60px] bg-white border-[0.5px] border-[#0f172a] rounded-[20px] px-5 font-['Baloo_Bhai_2'] text-2xl font-normal text-[#0f172a]/60 outline-none transition-all duration-200 focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] focus:text-[#0f172a] placeholder:text-[#0f172a]/60"
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
          className="w-[500px] max-w-[90vw] h-[60px] bg-[#0e34a0] border-none rounded-[20px] font-['Baloo_Bhai_2'] text-[32px] font-[200] text-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-[#2563eb] hover:-translate-y-px active:bg-[#1d4ed8] active:translate-y-0 mb-6 disabled:opacity-50 [filter:drop-shadow(4px_4px_5px_rgba(0,0,0,0.3))]"
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        <div className="flex flex-col items-center gap-0.5">
          <span className="font-['Baloo_Bhai_2'] text-2xl text-[#0f172a]">Forgot Password?</span>
        </div>

        <div className="w-[500px] max-w-[90vw] flex items-center gap-3">
          <div className="w-[218px] h-px bg-[#0f172a] flex-none" />
          <span className="font-['Baloo_Bhai_2'] text-[32px] text-[#0f172a] whitespace-nowrap">or</span>
          <div className="w-[218px] h-px bg-[#0f172a] flex-none" />
        </div>

        <button
          className="w-[500px] max-w-[90vw] h-[60px] rounded-[20px] font-['Baloo_Bhai_2'] text-2xl font-semibold text-[#0f172a] cursor-pointer flex items-center justify-center gap-3 transition-all duration-200 hover:opacity-88 hover:-translate-y-px active:translate-y-0 bg-white disabled:opacity-50 [filter:drop-shadow(4px_4px_5px_rgba(0,0,0,0.3))]"
          type="button"
          onClick={onGoogleSignIn}
          disabled={isLoading}
        >
          <img src={googleIcon} alt="Google" className="w-7 h-7 mix-blend-multiply" />
          Sign in with Google
        </button>

        <button
          className="w-[500px] max-w-[90vw] h-[60px] rounded-[20px] font-['Baloo_Bhai_2'] text-2xl font-semibold text-white cursor-pointer flex items-center justify-center gap-3 transition-all duration-200 hover:opacity-88 hover:-translate-y-px active:translate-y-0 bg-[#16213d] disabled:opacity-50 [filter:drop-shadow(4px_4px_5px_rgba(0,0,0,0.3))]"
          type="button"
          onClick={onAppleSignIn}
          disabled={isLoading}
        >
          <img src={appleIcon} alt="Apple" className="w-7 h-7" />
          Sign in with Apple
        </button>

        <div className="flex flex-col items-center gap-0.5">
          <span className="font-['Baloo_Bhai_2'] text-2xl text-[#0f172a]">Are you a new user?</span>
          <button
            className="font-['Baloo_Bhai_2'] text-2xl text-[#0f172a] underline cursor-pointer bg-transparent border-none p-0 transition-colors duration-150 hover:text-[#3b82f6]"
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