export const setToLocalStorage = (key, value) => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  return window.localStorage.setItem(key, value);
};

export const getFromLocalStorage = (key) => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  return window.localStorage.getItem(key);
};
