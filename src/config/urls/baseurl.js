import { API_URL } from "./env";
import axios from "axios";
import { getToken } from "../auth";
import { toast } from "react-toastify";

const socketId = window.Echo && window.Echo.socketId();

const baseurl = axios.create({
  baseURL: API_URL,
  timeout: 100000,
  headers: {
    "content-Type": "application/json",
    "X-Socket-ID": typeof socketId !== "undefined" ? socketId : null,
  },
});

baseurl.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

baseurl.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (process.env.NODE_ENV !== "production") {
        if (error.response.status === 500) {
          console.log(error.response.data);
        }
      }
    } else {
      toast.error(
        <div>
          <i className="fa fa-info-circle" /> Unknown Network Error occured!
        </div>,
        {
          position: "top-right",
          toastId: "error-404",
          className: "toastify-block",
          closeOnClick: true,
        }
      );
    }

    return Promise.reject(error);
  }
);

export default baseurl;
