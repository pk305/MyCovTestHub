import { destroyToken, setToken } from "src/config/auth";
import baseurl from "../../config/urls/baseurl";

const API = "api/v1/users";
const expiresAt = 60 * 24;

export const fetchUsers = () => {
  return new Promise((resolve, reject) => {
    baseurl
      .get(API)
      .then((res) => {
        if (res.data.length) {
          resolve(res.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const createUser = (data) => {
  return new Promise((resolve, reject) => {
    baseurl
      .post(API, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateUser = (data) => {
  return new Promise((resolve, reject) => {
    baseurl
      .put(API + "/" + data.id, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteUser = (Id) => {
  return new Promise((resolve, reject) => {
    baseurl
      .delete(`${API}/${Id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const createLoginUser = (data) => {
  return new Promise((resolve, reject) => {
    baseurl
      .post("api/v1/login", data)
      .then((res) => {
        setToken(res.data.access_token, { path: "/" });

        // if (data.rememberMe) {
        //   const options = { path: "/" };
        //   setToken(res.data.access_token, options);
        // } else {
        //   let date = new Date();
        //   date.setTime(date.getTime() + expiresAt + 60 * 1000);
        //   const options = { path: "/", expires: date };
        //   setToken(res.data.access_token, options);
        // }

        resolve();
      })
      .catch((error) => {
        let errResp = {};
        if (error.response) {
          if (error.response.status === 400) {
            errResp.badRequest = "Invalid Email or Password, Please try again";
          }
        }
        reject({ error, errResp });
      });
  });
};

export const fetchAuthUser = () => {
  return new Promise((resolve, reject) => {
    baseurl
      .get("api/v1/user")
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            destroyToken();
            window.location.href = "/login";
          }
        }
        reject(error);
      });
  });
};

export const logoutUser = (data) => {
  return new Promise((resolve) => {
    baseurl.post("api/v1/logout", data).then((res) => {
      resolve(res.data);
    });
  });
};
