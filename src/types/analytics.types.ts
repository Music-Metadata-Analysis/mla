import type EventDefinition from "@src/events/event.class";

export type EventDefinitionType = {
  category: "AUTH" | "LAST.FM" | "MAIN" | "TEST";
  label:
    | "AGGREGATE REQUESTS"
    | "BUTTON"
    | "CONTACT"
    | "DATA: ALBUM"
    | "DATA: ARTIST"
    | "DATA: ROOT"
    | "DATA: TRACK"
    | "DATA: UNKNOWN"
    | "ERROR"
    | "EXTERNAL_LINK"
    | "INTERNAL_LINK"
    | "LOGIN"
    | "LOGOUT"
    | "MODAL"
    | "REPORT"
    | "REQUEST"
    | "RESPONSE"
    | "TEST";
  action: string;
  value?: number;
};

export type EventCreatorType = (eventArgs: EventDefinition) => void;

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
