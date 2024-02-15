import axios from "axios";

const API_URL = "http://localhost:5000/api/users";


// get user names 
const getUser = async () => {
  try {
    // Retrieve the user object from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    // Extract the token from the user object
    const authToken = user ? user.token : null;

    if (!authToken) {
      // Handle the case when the token is not available
      throw new Error("Authentication token not found");
    }

    const response = await axios.get(API_URL + "/getUsersNames", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    // Handle the case when the token has expired
    if (error.response && error.response.status === 401) {
      console.log("Token expired. Logging out user.");
      // Perform any necessary actions to clear user-related data
      // For example, redirect to the login page or dispatch a logout action
      // You may also want to remove the user data from localStorage
      localStorage.removeItem("user");
      // Redirect to the login page or dispatch a logout action if needed
      window.location.href = "/login";
    }
    throw error; // Handle other errors in a more specific way if needed
  }
};

// Register User
const register = async (userData) => {
  const response = await axios.post(API_URL, userData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

// login User
const login = async (userData) => {
  const response = await axios.post(API_URL + "/login", userData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

const updateUserDetailes = async (userId, userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + "/updateUserData/" + userId, userData, config);

  // Return the updated user data directly
  return response.data;
};

// Logout User
const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  logout,
  login,
  getUser,
  updateUserDetailes
};

export default authService;
