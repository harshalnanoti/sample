import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserDetails } from "../features/auth/authSlice";

const UpdateUserinfo = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Assuming you have the user's ID and token available
    const userId = user._id;
    const token = user.token;

    // Dispatch the updateUserDetails thunk
    dispatch(updateUserDetails({ userId, userData: formData, token }));
  };

  return (
    <div>
      <section className="form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your password"
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-block">
              update
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default UpdateUserinfo;
