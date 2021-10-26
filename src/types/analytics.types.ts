import type { EventArgs } from "react-ga";

export type EventDefinitionType = {
  category: "AUTH" | "LAST.FM" | "MAIN" | "TEST";
  label:
    | "MODAL"
    | "BUTTON"
    | "CONTACT"
    | "DATA: ALBUM"
    | "DATA: ARTIST"
    | "DATA: TRACK"
    | "ERROR"
    | "EXTERNAL_LINK"
    | "LOGIN"
    | "LOGOUT"
    | "REPORT"
    | "REQUEST"
    | "RESPONSE"
    | "TEST";
  action: string;
  value?: number;
};

export type EventCreatorType = (eventArgs: EventArgs) => void;

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

export type ReportType = "BASE REPORT" | "TOP20 ALBUMS" | "TOP20 ARTISTS";
