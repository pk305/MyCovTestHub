import baseurl from "src/config/urls/baseurl";

const API = "api/v1/permissions";

export const fetchPermissions = () => {
  return new Promise((resolve) => {
    baseurl.get(API).then((res) => {
      if (res.data.length) {
        resolve(res.data);
      }
    });
  });
};

export const createPermission = (data) => {
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

export const addRolePermission = (data) => {
  return new Promise((resolve, reject) => {
    baseurl
      .post(`${API}/add_role`, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteRolePermission = (data) => {
  return new Promise((resolve, reject) => {
    baseurl
      .post(`${API}/del_role`, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
