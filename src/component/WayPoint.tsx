import { useRef, useState } from "react";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import { getStops } from "../client/transport";
import { ILocation } from "../client/types";

interface WayPointProps {
  label: string;
  testId?: string;
  onChange: (value?: ILocation) => void;
}

function WayPoint({ label, testId, onChange }: WayPointProps) {
  const [options, setOptions] = useState<ILocation[]>([]);
  const previousController = useRef<AbortController>();

  const getData = (query: string) => {
    if (previousController.current) {
      previousController.current.abort();
    }
    const controller = new AbortController();
    const signal = controller.signal;
    previousController.current = controller;

    getStops(query, signal).then(setOptions);
  };

  const onInputChange = (_event: any, value: string, _reason: any) => {
    if (value) {
      getData(value);
    } else {
      setOptions([]);
    }
  };

  const onChangeAutocomplete = (_event: any, value: any, reason: string) => {
    if (reason === "selectOption") {
      onChange(value);
    } else {
      onChange();
    }
  };

  return (
    <div className="waypoint">
      <Autocomplete
        onChange={onChangeAutocomplete}
        noOptionsText="No Stop found"
        options={options}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onInputChange={onInputChange}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            data-testid={testId}
            variant="outlined"
          />
        )}
      />
    </div>
  );
}

export default WayPoint;
