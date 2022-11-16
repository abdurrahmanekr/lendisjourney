import classNames from "classnames";

import { IJourneys, Journey } from "../client/types";
import Direction from "./Direction";

interface JourneysProps {
  journeys: IJourneys;
  selectedJourney: Journey;
  onSelect: (journey: Journey) => void;
}

function Journeys({ journeys, selectedJourney, onSelect }: JourneysProps) {
  return (
    <div className="journeys" data-testid="journeys">
      {journeys.journeys.map((journeyItem, i) => (
        <div
          key={i}
          onClick={() => onSelect(journeyItem)}
          className={classNames("journey", {
            active: selectedJourney === journeyItem,
          })}
          data-testid="journey"
        >
          <div className="journey-title">
            <div className="departure">{journeyItem.startTime}</div>
            <div className="arrival">{journeyItem.totalTime}</div>
          </div>
          <div>
            {journeyItem.legs.map((leg, j) => (
              <span key={j}>
                <Direction
                  directionName={j < 1 ? leg.direction : ""}
                  isWalking={leg.walking}
                  distance={leg.distance}
                  label={leg.origin.name}
                />

                <span className="breadcrumb">…</span>

                {journeyItem.legs.length - 1 === j && (
                  <Direction
                    isWalking={leg.walking}
                    distance={leg.distance}
                    label={leg.destination.name}
                  />
                )}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Journeys;
