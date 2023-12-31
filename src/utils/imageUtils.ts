export const getImageBlob = async (imageUrl: string) => {
  const imageResponse = await fetch(imageUrl);
  return imageResponse.blob();
};

export const cleanImage = (imageUrl: string) =>
  imageUrl.replace(/^data:image\/[a-z]+;base64/, "");
