import Cookies from "js-cookie";

export const getToken = () => {
  return Cookies.get(".Auth");
};

export const isLoggedIn = () => {
  if (getToken()) {
    return true;
  } else {
    return false;
  }
};

export const setToken = (token, options) => {
  Cookies.set(".Auth", token, options);
};

export const destroyToken = () => {
  Cookies.remove(".Auth");
};

export const setRememberMe = () => {
  // setRememberMe;
  if (isLoggedIn) {
    console.log(getToken);
  }
};
