import { Dispatch, SetStateAction } from "react";
import { DogResult, DogType } from "../types/payload.types";

export const checkForMatchingDogs = async (
  payload: { base64Image: string; type: DogType },
  getServerApi: Function,
  setMatchingReports: Dispatch<SetStateAction<DogResult[]>>,
  setIsModalOpen: Dispatch<SetStateAction<boolean>>,
) => {
  const serverApi = await getServerApi();
  try {
    const response = await serverApi.searchDog({ ...payload });
    const json = await response.json();
    if (json?.data?.results) {
      const threshold = 0.88;
      const filteredResults = json.data.results.filter(
        (result: DogResult) => result?.score && result.score >= threshold,
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
