import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { imageMimeType } from "../consts/formats";
import { DogDetailsReturnType } from "../types/DogDetailsTypes";
import { DogType } from "../types/payload.types";
import { useGetServerApi } from "../facades/ServerApi";

const checkForMatchingDogs = async (
  payload: { base64Image: string; type: DogType },
  getServerApi: Function,
  setMatchingReports: Dispatch<SetStateAction<DogDetailsReturnType[]>>,
  setIsModalOpen: Dispatch<SetStateAction<boolean>>,
) => {
  const serverApi = await getServerApi();
  try {
    const response = await serverApi.searchDog({
      ...payload,
      dogType: payload.type,
    });
    const json = await response.json();
    if (json?.data?.results) {
      const filteredResults = json.data.results.filter(
        (result: DogDetailsReturnType) =>
          result?.score && result.score >= 0.995,
      );
      if (filteredResults.length) {
        setMatchingReports(filteredResults);
        setIsModalOpen(true);
      }
    }
  } catch (error) {
    console.error(error); // eslint-disable-line
    throw new Error("Failed to fetch results");
  }
};

export const useImageSelection = (
  // the arguments are for the report pages and are used in `checkForMatchingDogs` function
  type?: DogType,
  setMatchingReports?: Dispatch<SetStateAction<DogDetailsReturnType[]>>,
  setIsModalOpen?: Dispatch<SetStateAction<boolean>>,
) => {
  const getServerApi = useGetServerApi();
  const [selectedImage, setSelectedImage] = useState<File>();
  const [imageURL, setImageURL] = useState<string | undefined>();

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
  };
};
