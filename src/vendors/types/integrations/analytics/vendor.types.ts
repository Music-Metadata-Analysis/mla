import type {
  AnalyticsEventDefinitionConstructorType,
  AnalyticsEventDefinitionInterface,
} from "@src/contracts/analytics/types/event.types";
import type EventDefinition from "@src/vendors/integrations/analytics/web/collection/event/event.class";

export interface AnalyticsVendorContextInterface {
  initialized: boolean;
  setInitialized: (setting: boolean) => void;
}

export interface AnalyticsVendorClientInterface {
  event: (event: EventDefinition) => void;
  initialize: (analyticsID: string) => void;
  routeChange: (url: string) => void;
}

export interface AnalyticsVendorProviderInterface {
  children: React.ReactNode;
}

export interface AnalyticsVendorHookInterface {
  event: (eventArgs: AnalyticsEventDefinitionInterface) => void;
  setup: () => void;
  trackButtonClick: (
    e: React.BaseSyntheticEvent,
    buttonName: React.ReactNode | string
  ) => void;
  trackExternalLinkClick: (e: React.BaseSyntheticEvent, href: string) => void;
  trackInternalLinkClick: (e: React.BaseSyntheticEvent, href: string) => void;
}

export interface AnalyticsVendorInterface {
  ClientClass: new () => AnalyticsVendorClientInterface;
  collection: {
    ConsentBannerComponent: () => JSX.Element;
    EventDefinition: AnalyticsEventDefinitionConstructorType;
    hook: (
      ClientClass: new () => AnalyticsVendorClientInterface
    ) => AnalyticsVendorHookInterface;
    Provider: ({ children }: { children: JSX.Element }) => JSX.Element;
  };
}
