import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import CircularProgress from "@mui/material/CircularProgress";

import WayPoint from "./component/WayPoint";
import LendisMap from "./component/LendisMap";
import Journeys from "./component/Journeys";

import { ILocation, IJourneys, Journey } from "./client/types";
import { getJourney } from "./client/transport";

interface AppProps {
  test?: boolean;
}
function App({ test }: AppProps) {
  const [start, setStart] = useState<ILocation>();
  const [end, setEnd] = useState<ILocation>();
  const [journeyDateTime, setJourneyDateTime] = useState<Date>(new Date());
  const [journeys, setJourneys] = useState<IJourneys>();
  const [journey, setJourney] = useState<Journey>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (!start || !end) return;

    setError(undefined);
    setLoading(true);

    (async () => {
      setJourneys(undefined);
      await getJourney(start.id, end.id, journeyDateTime)
        .then((journeys) => {
          setJourneys(journeys);
          setJourney(journeys.journeys[0]);
        })
        .catch((err) => {
          setError(err);
          setJourneys(undefined);
        })
        .finally(() => setLoading(false));
    })();
  }, [start, end, journeyDateTime]);

  const onDateStringChange = (event: any) => {
    setJourneyDateTime(new Date(event.target.value));
  };

  const currentTimeString = () => {
    const isoDate = journeyDateTime.toISOString();
    return isoDate.substring(0, isoDate.lastIndexOf(':'));
  };

  return (
    <div className="app">
      <div className="header">
        <div className="logo">LendisJourney</div>
      </div>
      <div className="container">
        <div className="row mt-5">
          <div className="picker col-12 col-md-6">
            <WayPoint label="Start" testId="start" onChange={setStart} />
            <div className="row">
              <div className="col-6">
                <WayPoint label="End" testId="end" onChange={setEnd} />
              </div>
              <div className="col-6">
                <TextField
                    label="Datetime"
                    type="datetime-local"
                    defaultValue={currentTimeString()}
                    className='fullw journey-time'
                    onChange={onDateStringChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
              </div>
            </div>
            {loading && (
              <div className="center-item" data-testid="loading">
                <CircularProgress />
              </div>
            )}
            {error && (
              <div className="error">An error occured. Please try again</div>
            )}
            {journeys && journey && (
              <Journeys
                journeys={journeys}
                selectedJourney={journey}
                onSelect={(journey) => setJourney(journey)}
              />
            )}
          </div>
          <div className="col-12 col-md-6">
            {!test && <LendisMap isLoading={loading} journey={journey} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
