import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { QueryPayload, ReportDogPayload } from "../types/payload.types";
import { UserRole } from "../types/UserRole";

interface DecodedUserData {
  iss: string;
  sub: string;
  aud: [string, string];
  iat: number;
  exp: number;
  azp: string;
  scope: string;
  permissions: string[];
}

const API_URL = process.env.REACT_APP_API_URL || "";

const buildEndpoint = (path: string) => `${API_URL}/dogfinder/${path}`;

class ServerApi {
  constructor(
    private token: string,
    private baseUrl: string,
  ) {}

  async fetch(
    url: RequestInfo,
    init?: Omit<RequestInit, "signal"> & { timeoutMs?: number },
  ) {
    const { token } = this;

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
    listAttributes?: Array<string> | undefined,
  ) {
    const formData = new FormData();
    const { token } = this;

    if (listAttributes) {
      listAttributes.forEach((listAttributeName) => {
        const values = data[listAttributeName];
        values.forEach((value: any) => {
          formData.append(listAttributeName, value);
        });

        delete data[listAttributeName]; // eslint-disable-line
      });
    }

    Object.keys(data).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        formData.append(key, data[key]);
      }
    });

    const response = await fetch(url, {
      method,
      body: formData,
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  }

  getUndecodedUserData(): string | null {
    return this.token ?? null;
  }

  getDecodedUserData(): DecodedUserData | null {
    return (jwtDecode(this.token) as DecodedUserData) ?? null;
  }

  getUserRole(): UserRole {
    // returns the role of the user as string, or null for "normal" users
    const user = this.getDecodedUserData();
    if (!user) return null;
    if (user.permissions.includes("delete:delete_dog_by_id")) return "admin";
    if (user.permissions.includes("read:dogs")) return "hamal";
    return null;
  }

  async searchDog(payload: QueryPayload) {
    const { dogType, ...newPayload } = payload;
    const url = buildEndpoint(`search_in_${dogType}_dogs`);

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
    const url = buildEndpoint("add_document");

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
    const url = buildEndpoint("add_possible_dog_match");
    return this.fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }

  async getUserReportedDogs() {
    const url = buildEndpoint("get_dogs_by_reporter_id");
    return this.fetch(url);
  }

  async getFullDogDetails(dogId: number) {
    const url = buildEndpoint(`get_dog_by_id?dogId=${dogId}`);
    return this.fetch(url);
  }

  async getAllReportedDogs(payload: {
    page: number;
    page_size: number;
    type?: String;
  }) {
    const url = new URL(buildEndpoint("dogs"));
    const stringKeys = Object.keys(payload) as Array<keyof typeof payload>;
    stringKeys.forEach((key) =>
      url.searchParams.append(key, payload[key]?.toString()!),
    );
    return this.fetch(url.toString());
  }

  async getPossibleMatches(payload: {
    page: number;
    page_size: number;
    dogId?: number; // if the dogId is null it will fetch all matches
  }) {
    const url = new URL(buildEndpoint("get_possible_dog_matches"));
    const stringKeys = Object.keys(payload) as Array<keyof typeof payload>;
    stringKeys.forEach((key) =>
      url.searchParams.append(key, payload[key]?.toString()!),
    );
    return this.fetch(url.toString());
  }

  async deleteDogById(dogId: string) {
    const url = buildEndpoint(`delete_dog_by_id?dogId=${dogId}`);
    return this.fetch(url, { method: "DELETE" });
  }
}

export const useGetServerApi = () => {
  const { getAccessTokenSilently } = useAuth0();
  return useCallback(
    async () => new ServerApi(await getAccessTokenSilently(), API_URL),
    [getAccessTokenSilently],
  );
};

export default ServerApi;
