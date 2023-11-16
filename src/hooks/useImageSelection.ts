import { useEffect, useState } from "react";
import { imageMimeType } from "../consts/formats";

export const useImageSelection = () => {
  const [selectedImage, setSelectedImage] = useState<File>();
  const [imageURL, setImageURL] = useState<string | undefined>();

  const onSelectImage = async (file: File) => {
    if (!file.type.match(imageMimeType)) {
      console.warn("Image mime type is not valid");
      return;
    }

    setSelectedImage(file);
  };

  const clearSelection = () => {
    setSelectedImage(undefined);
    setImageURL(undefined);
  };

  useEffect(() => {
    let fileReader: FileReader;
    let isCancelled: Boolean;

    if (selectedImage) {
      fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        const { result } = e.target;
        if (result && !isCancelled) {
          setImageURL(result);
        }
      };
      fileReader.readAsDataURL(selectedImage);
    }
    return () => {
      isCancelled = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [selectedImage]);

  return {
    onSelectImage,
    selectedImageUrl: imageURL,
    selectedImageFile: selectedImage,
    clearSelection,
  };
};
