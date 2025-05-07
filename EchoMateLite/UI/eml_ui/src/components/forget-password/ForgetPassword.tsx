import { useState, ChangeEvent, FormEvent } from "react";
import style from "./forgetpassword.module.css";

const ForgetPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your password reset logic here
    setMessage(
      "If an account with that email exists, you will receive a password reset link."
    );
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className={style.container}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      <p>
        Remember your password? <a href="/auth/login">Login</a>
      </p>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgetPassword;
