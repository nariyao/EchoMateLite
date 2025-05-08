import { useState, ChangeEvent, FormEvent } from "react";
import style from "./register.module.css";
import { FormData, Errors } from "./iRegister";
import useSubmitForm from "./hooks/useSubmitForm";
import useValidateForm from "./hooks/useValidateForm";

const Register: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const { submitForm, isLoading, error } = useSubmitForm();
  const validateForm = useValidateForm();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Errors = validateForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted successfully", formData);
      const response = await submitForm(formData);
      if (!error) {
        setMessage(error)
      }
      console.log("Form submitted successfully", response);
    }
  };

  return (
    <div className={style.register}>
      {message && <div className={style.error_msg}>{message}</div>}
      <div className={style.container}>
        <h2>Echo Mate Lite</h2>
        <form onSubmit={handleSubmit} >
          <section>
            <div>
              <label htmlFor='firstName'>
                {" "}
                First name<span className={style.required}> *</span>{" "}
              </label>
              <input disabled={isLoading}
                id='firstName'
                name='firstName'
                type='text'
                placeholder='First name'
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              {errors.firstName && (
                <span className={style.error}>{errors.firstName}</span>
              )}{" "}
            </div>
            <div>
              {" "}
              <label htmlFor='middleName'> Middle name</label>
              <input disabled={isLoading}
                id='middleName'
                name='middleName'
                type='text'
                placeholder='Middle name'
                value={formData.middleName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor='lastName'>
                {" "}
                Last name<span className={style.required}> *</span>{" "}
              </label>
              <input disabled={isLoading}
                id='lastName'
                name='lastName'
                type='text'
                placeholder='Last name'
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              {errors.lastName && (
                <span className={style.error}>{errors.lastName}</span>
              )}
            </div>
          </section>
          <section>
            <div>
              <label htmlFor='email'>
                {" "}
                Email<span className={style.required}> *</span>{" "}
              </label>
              <input disabled={isLoading}
                id='email'
                name='email'
                type='email'
                placeholder='Email'
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <span className={style.error}>{errors.email}</span>
              )}
            </div>
            <div>
              <label htmlFor='phone'>
                {" "}
                Phone<span className={style.required}> *</span>{" "}
              </label>
              <input disabled={isLoading}
                id='phone'
                name='phone'
                type='tel'
                placeholder='Phone'
                value={formData.phone}
                onChange={handleChange}
                required
              />
              {errors.phone && (
                <span className={style.error}>{errors.phone}</span>
              )}
            </div>
            <div>
              <label htmlFor='dob'>
                {" "}
                Date of birth<span className={style.required}> *</span>{" "}
              </label>
              <input disabled={isLoading}
                id='dob'
                name='dob'
                type='date'
                placeholder='DOB'
                value={formData.dob}
                onChange={handleChange}
                required
              />
              {errors.dob && <span className={style.error}>{errors.dob}</span>}
            </div>
          </section>
          <section>
            <div>
              <label htmlFor='line1'>
                {" "}
                Line 1<span className={style.required}> *</span>{" "}
              </label>
              <input disabled={isLoading}
                id='line1'
                name='line1'
                type='text'
                placeholder='Line 1'
                value={formData.line1}
                onChange={handleChange}
                required
              />
              {errors.line1 && (
                <span className={style.error}>{errors.line1}</span>
              )}
            </div>
            <div>
              <label htmlFor='line2'> Line 2</label>
              <input disabled={isLoading}
                id='line2'
                name='line2'
                type='text'
                placeholder='Line 2'
                value={formData.line2}
                onChange={handleChange}
              />
            </div>
          </section>
          <section>
            <div>
              <label htmlFor='city'>
                {" "}
                City<span className={style.required}> *</span>{" "}
              </label>
              <input disabled={isLoading}
                id='city'
                name='city'
                type='text'
                placeholder='City'
                value={formData.city}
                onChange={handleChange}
                required
              />
              {errors.city && <span className={style.error}>{errors.city}</span>}
            </div>
            <div>
              <label htmlFor='state'>
                {" "}
                State<span className={style.required}> *</span>{" "}
              </label>
              <input disabled={isLoading}
                id='state'
                name='state'
                type='text'
                placeholder='State'
                value={formData.state}
                onChange={handleChange}
                required
              />
              {errors.state && (
                <span className={style.error}>{errors.state}</span>
              )}
            </div>
            <div>
              <label htmlFor='country'>
                {" "}
                Country<span className={style.required}> *</span>{" "}
              </label>
              <input disabled={isLoading}
                id='country'
                name='country'
                type='text'
                placeholder='Country'
                value={formData.country}
                onChange={handleChange}
                required
              />
              {errors.country && (
                <span className={style.error}>{errors.country}</span>
              )}
            </div>
          </section>
          <section>
            <div>
              <label htmlFor='password'>
                {" "}
                Password<span className={style.required}> *</span>{" "}
              </label>
              <input disabled={isLoading}
                id='password'
                name='password'
                type='password'
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && (
                <span className={style.error}>{errors.password}</span>
              )}
            </div>
            <div>
              <label htmlFor='confirmPassword'>
                {" "}
                Confirm Password<span className={style.required}> *</span>{" "}
              </label>
              <input disabled={isLoading}
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                placeholder='Confirm Password'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              {errors.confirmPassword && (
                <span className={style.error}>{errors.confirmPassword}</span>
              )}
            </div>
          </section>
          <button type='submit' disabled={isLoading}>Register</button>
        </form>
        <p>
          Already have an account? <a href='/auth/login'>Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;