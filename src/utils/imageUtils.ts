export const getImageBlob = async (imageUrl: string) => {
    const imageResponse = await fetch(imageUrl);
    return await imageResponse.blob();
}


export const cleanImage = (imageUrl: string) => {
    return imageUrl.replace(/^data:image\/[a-z]+;base64/, "");
}