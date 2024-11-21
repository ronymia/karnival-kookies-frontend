export const getFullImageLink = (url, fileFolder) => {
  console.log({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL_Image}/${fileFolder}/${url}`,
  });
  return `${process.env.NEXT_PUBLIC_BACKEND_URL_Image}/${fileFolder}/${url}`;
};
