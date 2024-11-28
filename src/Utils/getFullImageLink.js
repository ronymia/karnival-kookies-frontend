export const getFullImageLink = (url) => {
  return `${process.env.NEXT_PUBLIC_BACKEND_URL_Image}/${url}`;
};
