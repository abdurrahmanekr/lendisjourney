import axios from "axios";

import { ILocation, IJourneys, Journey, Leg } from "./types";

const BASE_URL = "https://v5.db.transport.rest";

export async function getStops(
  query: string,
  signal: AbortSignal
): Promise<ILocation[]> {
  const queryParam = encodeURIComponent(query);
  return axios
    .get(`/locations?poi=false&addresses=false&query=${queryParam}`, {
      baseURL: BASE_URL,
      signal: signal,
    })
    .then((res) => res.data);
}

export async function getJourney(
  startID: string,
  endID: string,
  date: Date,
): Promise<IJourneys> {
  return axios
    .get<IJourneys>(`/journeys?from=${startID}&to=${endID}&stopovers=true&departure=${date.toISOString()}`, {
      baseURL: BASE_URL,
    })
    .then((res) => res.data)
    .then((res) => {
      return {
        journeys: res.journeys.map(
          (journey) =>
            new Journey({
              type: journey.type,
              legs: journey.legs.map((leg) => new Leg(leg)),
            })
        ),
      };
    });
}
