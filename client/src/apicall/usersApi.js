import { BASE_URL } from "../consts";

const { default: axiosInstance } = require(".");

// LOGIN USER
export const loginUser = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/auth/login`,
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

//REGISTER USER
export const registerUser = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:8080/api/auth/register",
      payload
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// Get USER INFO
export const getUserInfo = async () => {
  try {
    const response = await axiosInstance.get(
      "http://localhost:8080/api/users/getuser"
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
