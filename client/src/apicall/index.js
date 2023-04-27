import axios from "axios";

const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
  },
});
export default axiosInstance;
