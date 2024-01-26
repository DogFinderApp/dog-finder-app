import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { imageMimeType } from "../consts/formats";
import { DogResult, DogType } from "../types/payload.types";
import { useGetServerApi } from "../facades/ServerApi";
import { decryptData, encryptData } from "../utils/encryptionUtils";
import { checkForMatchingDogs } from "../utils/checkForMatchingDogs";

export const useImageSelection = (
  // the arguments are for the report pages and are used in `checkForMatchingDogs` function
  type?: DogType,
  setMatchingReports?: Dispatch<SetStateAction<DogResult[]>>,
  setIsModalOpen?: Dispatch<SetStateAction<boolean>>,
) => {
  const getServerApi = useGetServerApi();
  const [selectedImage, setSelectedImage] = useState<File>();
  const [imageURL, setImageURL] = useState<string | undefined>(
    decryptData("searchedDogImage") ?? undefined,
  );

  const onSelectImage = async (file: File) => {
    if (!file.type.match(imageMimeType)) {
      console.warn("Image mime type is not valid"); // eslint-disable-line
      return;
    }

    setSelectedImage(file);
  };

  const clearSelection = () => {
    setSelectedImage(undefined);
    setImageURL(undefined);
    localStorage.removeItem("searchedDogImage");
    if (setMatchingReports) setMatchingReports([]);
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
          encryptData("searchedDogImage", result); // memorize the link in order use it later in the report
          if (setMatchingReports && setIsModalOpen && type) {
            // should happen only in reports pages
            const prefix = "data:image/jpeg;base64,";
            // remove the prefix from the image string
            const base64Image = result.startsWith(prefix)
              ? result.slice(prefix.length)
              : result;
            const payload = { base64Image, type };
            checkForMatchingDogs(
              payload,
              getServerApi,
              setMatchingReports,
              setIsModalOpen,
            );
          }
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
  }, [selectedImage, getServerApi, setMatchingReports, setIsModalOpen, type]);

  return {
    onSelectImage,
    selectedImageUrl: imageURL,
    selectedImageFile: selectedImage,
    clearSelection,
    setImageURL,
  };
};
