import { DogType } from "../facades/payload.types";

export interface DogDetailsReturnType {
  id: number;
  images: [
    {
      base64Image: string;
      imageContentType: string;
      id: number;
    },
  ];
  type: DogType;
  isMatched: boolean;
  isVerified: boolean;
  name: string;
  breed: string;
  color: string;
  size: string;
  sex: "male" | "female";
  ageGroup: "puppy" | "adult" | "senior";
  extraDetails: string;
  chipNumber?: number; // returns only for Hamal users
  location: string;
  dogFoundOn: string;
  contactPhone: string;
}
