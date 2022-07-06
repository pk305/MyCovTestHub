import { useSelector } from "react-redux";

export const Can = (val) => {
  const isAble = useSelector((state) => state.chart.isAble);

  if (isAble.length) {
    if (!isAble.includes(val)) {
      return true;
    } else {
      return false;
    }
  } else {
    if (!isAble.includes(val)) {
      return true;
    } else {
      return false;
    }
  }
};

export const sysOnline = () => {
  return navigator.onLine;
};
