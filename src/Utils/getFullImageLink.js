export const getFullImageLink = (url, fileFolder) => {
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}/${fileFolder}/${url}`;
};
