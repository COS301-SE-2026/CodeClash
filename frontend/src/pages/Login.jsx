import "../styles/auth.css";
import shieldImg from "../assets/LightMode_Shield.png"

export default function Login() {
  return (
    <div className="signup-page">
      <button className="back-button">← Back</button>
      <div className="signup-container">
        <img src={shieldImg} alt="" className="shield-background" />
        <h1 className="signup-title">Let's sign you in</h1>
        <p className="login-subtitle">Welcome back!</p>
        
        <form className="signup-form">
          <input
            type="email"
            placeholder="Email address"
            className="signup-input"
          />
          <input
            type="password"
            placeholder="Password"
            className="signup-input"
          />
          <button type="submit" className="signup-button">
            Sign in
          </button>
          <div className="divider">
            <div className="line"></div>
            <p>or</p>
            <div className="line"></div>
          </div>
          <button type="button" className="social-button google-button">
            Sign in with Google
          </button>
          <button type="button" className="social-button apple-button">
            Sign in with Apple
          </button>
        </form>
        <p className="login-redirect">
          Are you a new user? <a href="/signup" className="login-redirect-link">Sign up</a>
        </p>
      </div>
    </div>
  );
}