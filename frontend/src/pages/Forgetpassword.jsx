import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ResetLinkForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const onChange = (e) => {
    setEmail(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/reset-link",
        { email }
      );
      console.log(response.data);
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success(response.data.success_msg);
        navigate("/login");
      }
    } catch (error) {
      console.error("An error occurred on the client:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  };

  return (
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
      <button type="submit">Send Reset Link</button>
    </form>
  );
};

export default ResetLinkForm;
