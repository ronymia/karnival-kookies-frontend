export const getDate = (date) => {
  return date?.split("T")[0];
};

export const getTime = (date) => {
  return date?.split("T")[1]?.split(".")[0];
};
