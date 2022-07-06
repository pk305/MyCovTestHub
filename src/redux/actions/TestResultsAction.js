import baseurl from "../../config/urls/baseurl";

const API = "api/v1/testResults";

export const fetchTestResults = () => {
  return new Promise((resolve) => {
    baseurl.get(API).then((res) => {
      if (res.data.length) {
        resolve(res.data);
      }
    });
  });
};

export const deleteTest = (Id) => {
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

export const createTestResults = (data) => {
  return new Promise((resolve, reject) => {
    baseurl
      .post("api/v1/postTestResults", data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
