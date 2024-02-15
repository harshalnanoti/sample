// components/ForgotPassword.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { postForgotPassword } from '../api/userApi'; // Adjust based on your API structure

const ForgotPassword = () => {
  const [email, setEmail] = useState(""); // Add email state
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const onChange = (e) => {
    setEmail(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call the API to handle the forgot password logic
      const response = await postForgotPassword({ password });

      // Dispatch actions or update state based on the API response
      dispatch(someAction(response));

      // Navigate to a different route if needed
      navigate("/reset-success");
    } catch (error) {
      // Handle errors, update state, or show error messages
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <section className="form">
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your register email"
              onChange={onChange}
            />
          </div>
        </section>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
