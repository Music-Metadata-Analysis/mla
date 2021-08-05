import type { EventArgs } from "react-ga";

export type EventDefinitionType = {
  category: "LASTFM" | "MAIN" | "TEST";
  label: "ERROR" | "REQUEST" | "REPORT_CREATED" | "CONTACT" | "BUTTON" | "TEST";
  action: string;
};

export type NavBarAvatarClickSource = "AVATAR: PROFILE" | "AVATAR: LASTFM";

export type EventCreatorType = (eventArgs: EventArgs) => void;

export type ButtonClickHandlerType = (
  e: React.MouseEvent<HTMLElement>,
  buttonName: React.ReactNode | string
) => void;

export interface AnalyticsContextInterface {
  initialized: boolean;
  setInitialized: (setting: boolean) => void;
}
export interface AnalyticsProviderInterface {
  children: React.ReactNode;
}
