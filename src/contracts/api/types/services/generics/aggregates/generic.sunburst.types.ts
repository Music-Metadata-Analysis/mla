export interface SunBurstData {
  name: string;
  value?: number;
  entity: "albums" | "artists" | "tracks" | "root" | "unknown";
  children?: SunBurstData[];
}
