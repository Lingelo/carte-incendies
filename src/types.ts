export interface Fire {
  id: number;
  date: string;
  lat: number;
  lng: number;
  dept: string;
  commune: string;
  surface: number;
  cause: string;
}

export interface FireMeta {
  demo: boolean;
  generatedAt: string;
  years: number[];
}

export interface FireData {
  meta: FireMeta;
  fires: Fire[];
}

export interface Filters {
  year: number | null;
  minSurface: number;
  causes: Set<string>;
}
