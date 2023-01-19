import type { AnalyticsEventDefinitionInterface } from "@src/contracts/analytics/types/event.types";

export type { AnalyticsEventDefinitionInterface } from "@src/contracts/analytics/types/event.types";

export type EventCreatorType = (
  eventArgs: AnalyticsEventDefinitionInterface
) => void;

export type ButtonClickHandlerType = (
  e: React.BaseSyntheticEvent,
  buttonName: React.ReactNode | string
) => void;

export type LinkClickHandlerType = (
  e: React.BaseSyntheticEvent,
  href: string
) => void;

export interface AnalyticsContextInterface {
  initialized: boolean;
  setInitialized: (setting: boolean) => void;
}
export interface AnalyticsProviderInterface {
  children: React.ReactNode;
}

export type IntegrationRequestType =
  | "ALBUM INFO"
  | "ARTIST GET ALBUMS"
  | "BASE"
  | "PLAYCOUNT BY ARTIST"
  | "TOP20 ALBUMS"
  | "TOP20 ARTISTS"
  | "TOP20 TRACKS"
  | "TRACK INFO";

export type SunBurstEntityTypes =
  | "ALBUM"
  | "ARTIST"
  | "ROOT"
  | "TRACK"
  | "UNKNOWN";
