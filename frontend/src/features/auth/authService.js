import axios from "axios";

const API_URL ="http://localhost:5000/api/users";

const getUser = async () => {
  try {
    // Retrieve the user object from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // Extract the token from the user object
    const authToken = user ? user.token : null;

    if (!authToken) {
      // Handle the case when the token is not available
      throw new Error('Authentication token not found');
    }

    const response = await axios.get(API_URL + '/getUsersNames', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error; // Handle errors in a more specific way if needed
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
  const response = await axios.post(API_URL  +  '/login', userData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

// Logout User
const logout = () =>{
  localStorage.removeItem("user")
}

const authService = {
  register,
  logout,
  login,
  getUser
};

export default authService;
