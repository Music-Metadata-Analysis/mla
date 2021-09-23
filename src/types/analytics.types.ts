import type { EventArgs } from "react-ga";

export type EventDefinitionType = {
  category: "LASTFM" | "MAIN" | "TEST";
  label:
    | "BUTTON"
    | "CONTACT"
    | "ERROR"
    | "EXTERNAL_LINK"
    | "REQUEST"
    | "REPORT_CREATED"
    | "REPORT_REQUESTED"
    | "TEST";
  action: string;
  value?: number;
};

export type NavBarAvatarClickSource = "AVATAR: PROFILE" | "AVATAR: LASTFM";

export type EventCreatorType = (eventArgs: EventArgs) => void;

export type ButtonClickHandlerType = (
  e: React.MouseEvent<HTMLElement>,
  buttonName: React.ReactNode | string
) => void;

export type LinkClickHandlerType = (
  e: React.MouseEvent<HTMLElement>,
  href: string
) => void;

export interface AnalyticsContextInterface {
  initialized: boolean;
  setInitialized: (setting: boolean) => void;
}
export interface AnalyticsProviderInterface {
  children: React.ReactNode;
}
