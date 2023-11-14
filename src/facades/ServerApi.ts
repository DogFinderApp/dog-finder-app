import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";
import { QueryPayload, ReportDogPayload } from "./payload.types";

const API_URL = process.env.REACT_APP_API_URL || "";

const build_endpoint = (path: string) => {
  return `${API_URL}/dogfinder/${path}`;
};

class ServerApi {
  constructor(private token: string, private baseUrl: string) {}

  async fetch(
    url: RequestInfo,
    init?: Omit<RequestInit, "signal"> & { timeoutMs?: number }
  ) {
    const token = this.token;

    let signal;
    let abortTimeout;
    if (init?.timeoutMs) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => controller.abort(), init.timeoutMs);
      signal = controller.signal;
    }

    const response = await fetch(url, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${token}`,
      },
      signal,
    });

    if (abortTimeout) clearTimeout(abortTimeout);
    return response;
  }

  async sendData(
    url: RequestInfo,
    data: { [key: string]: any },
    method: string,
    headers?: HeadersInit,
    listAttributes?: Array<string> | undefined
  ) {
    const formData = new FormData();
    const token = this.token;

    if (listAttributes) {
      listAttributes.forEach((listAttributeName) => {
        const values = data[listAttributeName];
        values.forEach((value: any) => {
          formData.append(listAttributeName, value);
        });

        delete data[listAttributeName];
      });
    }

    for (const value in data) {
      formData.append(value, data[value]);
    }

    const response = await fetch(url, {
      method: method,
      body: formData,
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  }

  async searchDog(payload: QueryPayload) {
    const { dogType, ...newPayload } = payload;
    const url = build_endpoint(`search_in_${dogType}_dogs`);

    return this.fetch(url, {
      method: "POST",
      body: JSON.stringify(newPayload),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  async report_dog(payload: ReportDogPayload) {
    let url = build_endpoint("add_document");

    return this.fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }

  async addPossibleDogMatch(payload: {
    dogId: number;
    possibleMatchId: number;
  }) {
    let url = build_endpoint("add_possible_dog_match");
    return this.fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }

  async getDogDetails(dogId: number) {
    let url = build_endpoint(`get_dog_by_id?dogId=${dogId}`);
    return this.fetch(url);
  }

  async getFullDogDetails(dogId: number) {
    const url = build_endpoint(`get_dog_by_id?dogId=${dogId}`);
    return this.fetch(url);
  }

  async getAllReportedDogs() {
    const url = build_endpoint("dogs");
    return this.fetch(url);
  }
}

export const useGetServerApi = () => {
  const { getAccessTokenSilently } = useAuth0();
  return useCallback(
    async () => new ServerApi(await getAccessTokenSilently(), API_URL),
    [getAccessTokenSilently]
  );
};

export default ServerApi;
