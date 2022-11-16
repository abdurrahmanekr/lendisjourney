import { render, screen, within } from "@testing-library/react";
import { IJourneys, Journey, Leg } from "../client/types";
import Journeys from "../component/Journeys";
import JourneyData from "./data/journey";

const journeys: IJourneys = {
  journeys: JourneyData.journeys.map(
    (journey) =>
      new Journey({
        type: journey.type,
        legs: journey.legs.map((leg) => new Leg(leg as any)),
      })
  ),
};

describe("Journeys test", () => {
  test("destination and arrival time should be render", () => {
    const selectedJourney = journeys.journeys[0];
    render(
      <Journeys
        journeys={journeys}
        selectedJourney={selectedJourney}
        onSelect={jest.fn}
      />
    );

    const journey = screen.getAllByTestId("journey")[0];
    const departure = journey.querySelectorAll(".departure")[0];
    const arrival = journey.querySelectorAll(".arrival")[0];

    expect(journey.className).toContain("active");
    expect(departure.innerHTML).toEqual(selectedJourney.startTime);
    expect(arrival.innerHTML).toEqual(selectedJourney.totalTime);
  });

  test("last leg should be show target", () => {
    const selectedJourney = journeys.journeys[0];
    render(
      <Journeys
        journeys={journeys}
        selectedJourney={selectedJourney}
        onSelect={jest.fn}
      />
    );

    const journey = screen.getAllByTestId("journey")[0];
    const allLegs = within(journey).getAllByTestId("label");
    const lastLeg = allLegs[allLegs.length - 1];

    expect(lastLeg.innerHTML).toEqual(
      selectedJourney.legs[selectedJourney.legs.length - 1].destination.name
    );
  });
});
