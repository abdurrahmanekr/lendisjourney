import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import CircularProgress from "@mui/material/CircularProgress";

import { Journey } from "../client/types";

interface LendisMapProps {
  journey?: Journey;
  isLoading?: boolean;
}

const MAPBOX_API_KEY =
  "pk.eyJ1IjoiYWJkdXJyYWhtYW5la3IiLCJhIjoiY2xhZjJ3b3d5MHkxajNwb3kwaDR0dzg5MCJ9.Al1nodET0wLZP84imvSzrg";

let map: L.Map;

function LendisMap({ journey, isLoading }: LendisMapProps) {
  useEffect(() => {
    if (!map) {
      map = L.map("map", {
        center: [50, 10],
        zoom: 4,
        preferCanvas: true,
      });
    }

    L.tileLayer(
      `https://api.mapbox.com/styles/v1/abdurrahmanekr/claf3f5qp00bj15n7agf25qxq/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_API_KEY}`,
      {
        maxZoom: 18,
        id: "mapbox/streets-v11",
        accessToken: MAPBOX_API_KEY,
        attribution: "LendisMap © 2022",
      }
    ).addTo(map);

    if (journey) {
      loadJourney(journey);
    }
  }, [journey]);

  const loadJourney = (journey: Journey) => {
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        return;
      }
      map.removeLayer(layer);
    });

    journey.legs.forEach((leg) => {
      L.polyline(leg.lineLatLng, { color: leg.color }).addTo(map);

      leg.lineLatLng.forEach((stop) => {
        L.circle(stop, { radius: 10 }).addTo(map);
      });
    });

    map.fitBounds(journey.totalBounds);
  };

  return (
    <div className="map-content-container">
      {isLoading && (
        <div className="loading-indicator">
          <CircularProgress />
        </div>
      )}
      <div id="map" className="map" data-testid="map"></div>
    </div>
  );
}

export default LendisMap;
