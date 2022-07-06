import baseurl from "src/config/urls/baseurl";

const API = "api/v1/roles";

export const fetchRoles = () => {
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

export const createRole = (data) => {
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

export const updateRole = (data) => {
  return new Promise((resolve, reject) => {
    baseurl
      .put(`${API}/${data.id}`, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const findRole = (Id) => {
  return new Promise((resolve, reject) => {
    baseurl
      .get(`${API}/${Id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteRole = (Id) => {
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

export const rollbackDeleteRole = (Id) => {
  return new Promise((resolve, reject) => {
    baseurl
      .post(`${API}/rollback_del`, Id)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
