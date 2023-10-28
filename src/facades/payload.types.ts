import { Dayjs } from "dayjs";

export enum DogType {
    LOST = "lost",
    FOUND = "found",
}

export enum DogSex {
    FEMALE = "female",
    MALE = "male",
}

export interface QueryPayload {
    type: DogType;
    img: Blob;
}

export interface ReportDogPayload {
    type: DogType;
    imgs: Array<Blob>;
    contactName: string;
    contactPhone: string;
    contactEmail?: string;
    contactAdress?: string;
    foundAtLocation: string;
    date: string | Dayjs | null;
    breed?: string;
    color?: string;
    size?: string;
    sex?: string;
    location?: string;
    chipNumber: string;
    extraDetails?: string;
}

export interface DogResult {
    dogId: string;
    contactName: string;
    contactPhone: string;
    contactEmail?: string;
    contactAdress?: string;
    breed?: string;
    color?: string;
    size?: string;
    sex?: string;
    location?: string;
    chipNumber: string;
    extraDetails?: string;
    imageBase64: string;
    imageContentType: string;
}
