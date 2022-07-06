import baseurl from "../../config/urls/baseurl";

const API = "api/v1/chartReports";

export const getPostiveNegativeCases = () => {
  return new Promise((resolve, reject) => {
    baseurl
      .get(`${API}/positivePerNegative`)
      .then((res) => {
        if (res.data.length) {
          resolve(res.data);
        }
      })
      .catch((error) => {
        return reject(error);
      });
  });
};

export const getCaseByPostcode = () => {
  return new Promise((resolve, reject) => {
    baseurl
      .get(`${API}/getCaseByPostcode`)
      .then((res) => {
        if (res.data.length) {
          resolve(res.data);
        }
      })
      .catch((error) => {
        return reject(error);
      });
  });
};

export const getCaseByAgeGroup = () => {
  return new Promise((resolve, reject) => {
    baseurl
      .get(`${API}/getCaseByAgeGroup`)
      .then((res) => {
        if (res.data.length) {
          resolve(res.data);
        }
      })
      .catch((error) => {
        return reject(error);
      });
  });
};
