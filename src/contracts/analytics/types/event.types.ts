export interface AnalyticsEventDefinitionInterface {
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
}

export type AnalyticsEventDefinitionConstructorType = new ({
  category,
  label,
  action,
  value,
}: AnalyticsEventDefinitionInterface) => AnalyticsEventDefinitionInterface;
