import React, { useEffect, useState } from "react";
import validate from "./validate";
import "./styles.css";

function LoginForm() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (event) => {
    setSubmitting(true);
    event.preventDefault();
    await new Promise((r) => setTimeout(r, 1000));
    setErrors(validate(values));
  };

  useEffect(() => {
    if (submitting) {
      if (Object.keys(errors).length === 0) {
        alert(JSON.stringify(values, null, 2));
      }
      setSubmitting(false);
    }
  }, [errors]);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          className={errors.email && "errorInput"}
        />
        {errors.email && <span className="errorMessage">{errors.email}</span>}
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          className={errors.email && "errorInput"}
        />
        {errors.password && (
          <span className="errorMessage">{errors.password}</span>
        )}
      </label>
      <br />
      <button type="submit" disabled={submitting}>
        로그인
      </button>
    </form>
  );
}
