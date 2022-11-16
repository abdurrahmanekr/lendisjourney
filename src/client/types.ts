import L from "leaflet";
import juration from "juration";

export interface IGeoLocation {
  type: string;
  id: string;
  latitude: number;
  longitude: number;
}

export interface IProducts {
  nationalExpress: boolean;
  national: boolean;
  regionalExp: boolean;
  regional: boolean;
  suburban: boolean;
  bus: boolean;
  ferry: boolean;
  subway: boolean;
  tram: boolean;
  taxi: boolean;
}

export interface ILocation {
  type: string;
  id: string;
  name: string;
  location: IGeoLocation;
  products: IProducts;
}

export interface IJourney {
  type: string;
  legs: Leg[];
}

export class Journey implements IJourney {
  type: string;
  legs: Leg[];

  constructor({ type, legs }: IJourney) {
    this.type = type;
    this.legs = legs;
  }

  public get totalTime(): string {
    const diff =
      +new Date(this.legs[this.legs.length - 1].plannedArrival) -
      +new Date(this.legs[0].plannedDeparture);

    return juration.stringify(Math.floor(diff / 1000), {
      format: "long",
      units: 2,
    });
  }

  public get startTime(): string {
    const departure = new Date(
      this.legs[this.legs.length - 1].plannedDeparture
    );

    return departure.toLocaleDateString("en", {
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
    });
  }

  public get totalBounds(): L.LatLngBounds {
    return L.latLngBounds(
      L.latLng(
        this.legs[0].origin.location.latitude,
        this.legs[0].origin.location.longitude
      ),
      L.latLng(
        this.legs[this.legs.length - 1].destination.location.latitude,
        this.legs[this.legs.length - 1].destination.location.longitude
      )
    );
  }
}

export interface IJourneys {
  journeys: Journey[];
}

export interface ILine {
  type: string;
  id: string;
  name: string;
  mode: string;
  product: string;
}

export interface IStop {
  type: string;
  id: string;
  name: string;
  location: IGeoLocation;
  products: IProducts;
}

export interface IStopovers {
  stop: IStop;
}

export interface ILeg {
  tripId: string;
  direction: string;
  line: ILine;
  origin: IStop;
  plannedDeparture: Date;
  destination: IStop;
  plannedArrival: Date;
  walking: boolean;
  distance: number;
  stopovers: IStopovers[];
}

export class Leg implements ILeg {
  tripId: string;
  direction: string;
  line: ILine;
  origin: IStop;
  plannedDeparture: Date;
  destination: IStop;
  plannedArrival: Date;
  walking: boolean;
  distance: number;
  stopovers: IStopovers[];

  constructor({
    tripId,
    direction,
    line,
    origin,
    plannedDeparture,
    destination,
    plannedArrival,
    walking,
    distance,
    stopovers,
  }: ILeg) {
    this.tripId = tripId;
    this.direction = direction;
    this.line = line;
    this.origin = origin;
    this.plannedDeparture = plannedDeparture;
    this.destination = destination;
    this.plannedArrival = plannedArrival;
    this.walking = walking;
    this.distance = distance;
    this.stopovers = stopovers;
  }

  public get lineLatLng(): L.LatLng[] {
    if (this.walking) {
      return [
        L.latLng(this.origin.location.latitude, this.origin.location.longitude),
        L.latLng(
          this.destination.location.latitude,
          this.destination.location.longitude
        ),
      ];
    }

    return this.stopovers.map((stopover) => {
      return L.latLng(
        stopover.stop.location.latitude,
        stopover.stop.location.longitude
      );
    });
  }

  public get color(): string {
    if (this.walking) {
      return "red";
    }

    let hash = 0;
    for (let i = 0; i < this.line.id.length; i++) {
      hash = this.line.id.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
    }
    return `hsl(${hash % 360}, 100%, 50%)`;
  }
}
