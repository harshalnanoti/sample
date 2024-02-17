import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PasswordResetForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Token from URL:", token);
  }, [token]);

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter your new password");
      return;
    }

    try {
      // Make a POST request to the backend to reset the password
      const response = await axios.post(
        `http://localhost:5000/api/users/rechange-password/${token}`,
        {
          password,
        }
      );

      console.log(response.data);
      if (response.data.error) {
        setError(response.data.error);
        toast.error(response.data.error);
      } else {
        setError("");
        toast.success(response.data.success_msg);
        navigate("/login");
      }
    } catch (error) {
      console.error("An error occurred on the client:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
        toast.error(error.response.data.error);
      } else {
        setError("Unexpected error occurred");
        toast.error("Unexpected error occurred");
      }
    }
  };

  return (
    <>
      <section className="form">
        <form onSubmit={handleSubmit}>
          <h2 className="heading items-center">Password Reset Form</h2>
          <div className="form-group">
            <label htmlFor="password">New Password:</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <div className="form-group">
            <button type="submit" className="btn btn-block">
              Reset
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default PasswordResetForm;
