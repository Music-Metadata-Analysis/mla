import type { EventArgs } from "react-ga";

export type EventDefinitionType = {
  category: "LASTFM" | "MAIN" | "TEST";
  label:
    | "BUTTON"
    | "CONTACT"
    | "DATA: ALBUM"
    | "ERROR"
    | "EXTERNAL_LINK"
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
