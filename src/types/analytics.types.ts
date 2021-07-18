import { EventArgs } from "react-ga";

export type EventDefinitionType = {
  category: "LASTFM" | "MAIN" | "TEST";
  label: "ERROR" | "REQUEST" | "REPORT_CREATED" | "CONTACT" | "TEST";
  action: string;
};

export type eventCreatorType = (eventArgs: EventArgs) => void;

export interface AnalyticsContextInterface {
  initialized: boolean;
  setInitialized: (setting: boolean) => void;
}
export interface AnalyticsProviderInterface {
  children: React.ReactNode;
}
