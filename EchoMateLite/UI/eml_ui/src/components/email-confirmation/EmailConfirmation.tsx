import { useState, ChangeEvent, FormEvent } from "react";
import style from "./emailConfirmation.module.css";

const EmailConfirmation: React.FC = () => {
  const [confirmationCode, setConfirmationCode] = useState<string>("");
  const [errors, setErrors] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmationCode(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Confirmation code validation logic
    if (!confirmationCode) {
      setErrors("Confirmation code is required");
    } else if (confirmationCode !== "123456") { // Example validation, replace with actual logic
      setErrors("Invalid confirmation code");
    } else {
      setErrors("");
      console.log("Email confirmed successfully");
    }
  };

  return (
    <div className={style.container}>
      <h2>Email Confirmation</h2>
      <p>A confirmation email has been sent to your email address. Please enter the confirmation code below to verify your email.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="confirmationCode">
            Confirmation Code<span className={style.required}> *</span>
          </label>
          <input
            id="confirmationCode"
            name="confirmationCode"
            type="text"
            placeholder="Enter confirmation code"
            value={confirmationCode}
            onChange={handleChange}
            required
          />
          {errors && <span className={style.error}>{errors}</span>}
        </div>
        <button type="submit">Confirm Email</button>
      </form>
      <p>Din&apos;t receive the email? <a href="/">Resend confirmation email</a></p>
    </div>
  );
};

export default EmailConfirmation;
