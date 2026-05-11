import "../styles/auth.css";
import shieldImg from "../assets/LightMode_Shield.png"

export default function SignUp() {
  return (
    <div className="signup-page">

      <button className="back-button">← Back</button>

      <div className="signup-container">
        <img src={shieldImg} alt="" className="shield-background" />

        <h1 className="signup-title">Sign Up</h1>

        <form className="signup-form">

          <input
            type="text"
            placeholder="First name"
            className="signup-input"
          />

          <input
            type="text"
            placeholder="Last name"
            className="signup-input"
          />

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

          <div className="terms-row">
            <input type="checkbox" className="checkbox" />

            <p>
              Accept <span>Terms & Conditions</span>
            </p>
          </div>

          <button type="submit" className="signup-button">
            Sign up
          </button>

          <div className="divider">
            <div className="line"></div>
            <p>or</p>
            <div className="line"></div>
          </div>

          <button type="button" className="social-button google-button">
            Sign up with Google
          </button>

          <button type="button" className="social-button apple-button">
            Sign up with Apple
          </button>

        </form>
      </div>
    </div>
  );
}