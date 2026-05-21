import React, { useState } from "react";
import googleIcon from "../assets/Google_Icon.png";
import appleIcon from "../assets/Apple_Icon.png";
import { useAuth } from "../context/AuthContext";

interface SignUpProps {
  onBack?: () => void;
  onGoogleSignUp?: () => void;
  onAppleSignUp?: () => void;
  onSignIn?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({
  onBack,
  onGoogleSignUp,
  onAppleSignUp,
  onSignIn,
}) => {
  const {
    signUp,
    confirmSignUp,
    resendSignUpCode,
    error,
    clearError,
    isLoading,
  } = useAuth();
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    if (!username.trim()) {
      setLocalError("Username is required");
      return false;
    }
    if (!firstName.trim()) {
      setLocalError("First name is required");
      return false;
    }
    if (!lastName.trim()) {
      setLocalError("Last name is required");
      return false;
    }
    if (!email.trim()) {
      setLocalError("Email is required");
      return false;
    }
    if (!phoneNumber.trim()) {
      setLocalError("Phone number is required");
      return false;
    }
    if (!password || password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return false;
    }
    if (!acceptedTerms) {
      setLocalError("You must accept the terms and conditions");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    clearError();
    setLocalError(null);
    if (!validate()) return;
    try {
      await signUp({
        username: username.trim(),
        firstName,
        lastName,
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        password,
      });
      setNeedsConfirmation(true);
    } catch {
      // error set by context
    }
  };

  const handleConfirm = async () => {
    clearError();
    setLocalError(null);
    if (!confirmationCode.trim()) {
      setLocalError("Confirmation code is required");
      return;
    }
    try {
      await confirmSignUp(username.trim(), confirmationCode.trim());
      onSignIn?.();
    } catch {
      // error set by context
    }
  };

  const handleResend = async () => {
    clearError();
    setLocalError(null);
    setResendMessage(null);
    try {
      await resendSignUpCode(username.trim());
      setResendMessage("Code sent! Check your email.");
    } catch {
      // error set by context
    }
  };

  const displayError = localError ?? error;

  const inputClasses = "w-full max-w-md h-14 bg-white border border-[#0f172a] rounded-lg px-5 font-['Baloo_Bhai_2'] text-2xl text-[#0f172a]/60 outline-none transition-all duration-200 focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] focus:text-[#0f172a] placeholder:text-[#0f172a]/60 disabled:opacity-50";
  const btnClasses = "w-full max-w-md h-14 bg-[#3b82f6] border-2 border-[#0f172a] rounded-lg font-['Baloo_Bhai_2'] text-3xl font-semibold text-[#0f172a] cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-[#2563eb] hover:-translate-y-px active:bg-[#1d4ed8] active:translate-y-0 disabled:opacity-50";

  if (needsConfirmation) {
    return (
      <div className="w-full min-h-screen bg-[#f8fafc] flex items-center justify-center overflow-hidden relative">
        <button
          className="absolute top-10 left-10 w-[91px] h-[31px] bg-white border border-[#0f172a] rounded-md font-['Baloo_Bhai_2'] text-base text-[#0f172a] cursor-pointer flex items-center justify-center gap-1 transition-colors duration-150 hover:bg-[#f1f5f9]"
          onClick={() => setNeedsConfirmation(false)}
          type="button"
        >
          ← Back
        </button>
        <div className="flex flex-col items-center gap-4 w-full max-w-[560px] relative z-10">
          <h1 className="font-['Baloo_Bhai_2'] font-bold text-4xl sm:text-5xl text-[#0f172a] leading-tight text-center mb-1">Verify your email</h1>
          <p className="mb-4">Enter the code sent to {email}</p>
          {displayError && <p className="text-red-500 text-sm text-center mb-2">{displayError}</p>}
          {resendMessage && (
            <p className="text-green-500 text-sm text-center mb-2">{resendMessage}</p>
          )}
          <input
            className={inputClasses}
            type="text"
            placeholder="Confirmation code"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            disabled={isLoading}
          />
          <button
            className={btnClasses}
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Confirm"}
          </button>
          <button
            className="w-full max-w-md h-14 bg-transparent border border-[#3b82f6] rounded-lg font-['Baloo_Bhai_2'] text-3xl font-semibold text-[#3b82f6] cursor-pointer flex items-center justify-center transition-all duration-200 hover:opacity-80 mt-2 disabled:opacity-50"
            type="button"
            onClick={() => resendSignUpCode(email.trim())}
            disabled={isLoading}
          >
            Resend code
          </button>
        </div>
      </div>
    );
  }

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
        <h1 className="font-['Baloo_Bhai_2'] font-bold text-4xl sm:text-5xl lg:text-6xl text-[#0f172a] leading-tight text-center mb-1">Sign Up</h1>

        {displayError && <p className="text-red-500 text-sm text-center mb-2">{displayError}</p>}

        <input className={inputClasses} type="text" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" disabled={isLoading} />
        <input className={inputClasses} type="text" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" disabled={isLoading} />
        <input className={inputClasses} type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" disabled={isLoading} />
        <input className={inputClasses} type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" disabled={isLoading} />
        <input className={inputClasses} type="tel" placeholder="Phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} autoComplete="tel" disabled={isLoading} />
        <input className={inputClasses} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" disabled={isLoading} />

        <div className="w-full max-w-md flex items-center gap-3">
          <input
            className="w-[31px] h-[31px] min-w-[31px] appearance-none bg-white border border-[#0f172a] rounded cursor-pointer flex items-center justify-center relative transition-colors duration-150 checked:bg-[#3b82f6] checked:border-[#3b82f6] checked:after:content-[''] checked:after:absolute checked:after:w-[10px] checked:after:h-[16px] checked:after:border-2 checked:after:border-white checked:after:border-t-0 checked:after:border-l-0 checked:after:rotate-45 checked:after:translate-x-[-1px] checked:after:translate-y-[-2px]"
            type="checkbox"
            id="acceptTerms"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            disabled={isLoading}
          />
          <label className="font-['Baloo_Bhai_2'] text-base text-[#0f172a] cursor-pointer" htmlFor="acceptTerms">
            Accept <a className="text-[#0f172a] underline" href="#">Terms &amp; Conditions</a>
          </label>
        </div>

        <button className={btnClasses} type="button" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign up"}
        </button>

        <div className="w-full max-w-md flex items-center gap-3">
          <div className="w-[218px] h-px bg-[#0f172a]/10 flex-none" />
          <span className="font-['Baloo_Bhai_2'] text-base text-[#0f172a] whitespace-nowrap">or</span>
          <div className="w-[218px] h-px bg-[#0f172a]/10 flex-none" />
        </div>

        <button className="w-full max-w-md h-14 border border-[#0f172a] rounded-lg font-['Baloo_Bhai_2'] text-2xl font-semibold text-[#0f172a] cursor-pointer flex items-center justify-center gap-3 transition-all duration-200 hover:opacity-85 hover:-translate-y-px active:translate-y-0 bg-[#a78bfa] disabled:opacity-50" type="button" onClick={onGoogleSignUp} disabled={isLoading}>
          <img src={googleIcon} alt="Google" className="w-7 h-7 mix-blend-multiply" />
          Sign up with Google
        </button>

        <button className="w-full max-w-md h-14 border border-[#0f172a] rounded-lg font-['Baloo_Bhai_2'] text-2xl font-semibold text-[#0f172a] cursor-pointer flex items-center justify-center gap-3 transition-all duration-200 hover:opacity-85 hover:-translate-y-px active:translate-y-0 bg-[#3b82f6] disabled:opacity-50" type="button" onClick={onAppleSignUp} disabled={isLoading}>
          <img src={appleIcon} alt="Apple" className="w-7 h-7 mix-blend-multiply" />
          Sign up with Apple
        </button>
      </div>
    </div>
  );
};

export default SignUp;