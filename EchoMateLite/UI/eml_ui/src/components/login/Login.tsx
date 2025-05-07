import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import SLogin from "./login.module.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateEmail(email) && validatePassword(password)) {
      // Add your login logic here
      console.log("Email:", email);
      console.log("Password:", password);
    }
  };

  const handleRegister = () => {
    navigate("/auth/register");
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string): boolean => {
    // Example password regex:
    //  at least 8 characters,
    //  one uppercase letter,
    //  one lowercase letter,
    //  one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one number"
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  return (
    <div className={SLogin.login}>
      <div className={SLogin.container}>
        <h2>Echo Mate Lite</h2>
        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email</label>
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
              {emailError && <span className='error'>{emailError}</span>}
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />
              {passwordError && <span className='error'>{passwordError}</span>}
            </div>
            <button type="submit">Login</button>
            <button type="button" onClick={handleRegister} className='register-button'>
              Register
            </button>
          </form>
          <p>
            Forgot your password? <a href='/auth/forget-password'>Reset password</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
