export const setToLocalStorage = (key, value) => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  const serialized = typeof value === "string" ? value : JSON.stringify(value);
  return window.localStorage.setItem(key, serialized);
};

export const getFromLocalStorage = (key) => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  return window.localStorage.getItem(key) || "";
};

export const removeFromLocalStorage = (key) => {
  if (!key || typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(key);
};
