export enum DogType {
    LOST = "lost", 
    FOUND = "found"
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
    contactAdress?: string
    foundAtLocation: string;
    breed?: string;
    color?: string;
    size?: string;    
    chipNumber: string;
    extraDetails?: string;
}