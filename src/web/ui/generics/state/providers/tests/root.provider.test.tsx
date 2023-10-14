import { waitFor, screen, render } from "@testing-library/react";
import ControllersRootProvider from "../controllers.provider";
import RootProvider from "../root.provider";
import { popUps } from "@src/config/popups";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";
import { mockAuthProvider } from "@src/vendors/integrations/auth/__mocks__/vendor.mock";
import { flagVendor } from "@src/vendors/integrations/flags/vendor";
import { uiFrameworkVendor } from "@src/vendors/integrations/ui.framework/vendor";
import HeaderContainer from "@src/web/content/header/components/header.container";
import MetricsProvider from "@src/web/metrics/collection/state/providers/metrics.provider";
import ReportProvider from "@src/web/reports/generics/state/providers/report.provider";
import type { AuthVendorStateType } from "@src/vendors/types/integrations/auth/vendor.types";
import type { FlagVendorStateInterface } from "@src/vendors/types/integrations/flags/vendor.types";

jest.mock("@src/vendors/integrations/analytics/vendor");

jest.mock("@src/vendors/integrations/auth/vendor");

jest.mock("@src/vendors/integrations/flags/vendor");

jest.mock("@src/vendors/integrations/ui.framework/vendor");

jest.mock("@src/web/content/header/components/header.container", () =>
  require("@fixtures/react/parent").createComponent("HeaderContainer")
);

jest.mock("../controllers.provider", () =>
  require("@fixtures/react/parent").createComponent("ControllersRootProvider")
);

jest.mock("@src/web/metrics/collection/state/providers/metrics.provider", () =>
  require("@fixtures/react/parent").createComponent("MetricsProvider")
);

jest.mock("@src/web/reports/generics/state/providers/report.provider", () =>
  require("@fixtures/react/parent").createComponent("ReportProvider")
);

const providers = {
  AnalyticsProvider: "AnalyticsProvider",
  AuthVendorProvider: "AuthVendorProvider",
  ControllersRootProvider: "ControllersRootProvider",
  FlagVendorProvider: "FlagVendorProvider",
  HeaderContainer: "HeaderContainer",
  MetricsProvider: "MetricsProvider",
  ReportProvider: "ReportProvider",
  RootProvider: "RootProvider",
  UserInterfacePopUpsProvider: "UserInterfacePopUpsProvider",
  UserInterfaceVendorProvider: "UserInterfaceVendorProvider",
};

describe("RootProvider", () => {
  const mockCookies = { mockCookie: "mockCookieValue" };
  const mockPageKey = "test";
  const mockFlagState = {
    serverState: {
      api: "unknown",
      environmentID: "unknown",
      flags: {},
      identity: "unknown",
      traits: {},
    },
    identity: "mockIdentity",
  };
  const mockSession = {
    testSession: true,
  } as unknown as AuthVendorStateType;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = async (
    flagState: FlagVendorStateInterface,
    pageKey?: string
  ) => {
    const headerProps = pageKey ? { pageKey } : undefined;
    render(
      <RootProvider
        cookies={mockCookies}
        session={mockSession}
        headerProps={headerProps}
        flagState={flagState}
      >
        <div data-testid={providers.RootProvider}>Test</div>
      </RootProvider>
    );
  };

  describe("When Rendered, with flagState, but without a pageKey", () => {
    beforeEach(() => arrange(mockFlagState));

    it("should call the HeaderContainer component correctly", async () => {
      await waitFor(() => expect(HeaderContainer).toBeCalledTimes(1));
      await waitFor(() =>
        expect(HeaderContainer).toBeCalledWith({ pageKey: "default" }, {})
      );
      expect(await screen.findByTestId(providers.HeaderContainer)).toBeTruthy;
    });

    it("should call the FlagVendorProvider component correctly", async () => {
      await waitFor(() => expect(flagVendor.Provider).toBeCalledTimes(1));
      await waitFor(() =>
        checkMockCall(flagVendor.Provider, {
          state: mockFlagState,
        })
      );
      expect(await screen.findByTestId(providers.FlagVendorProvider))
        .toBeTruthy;
    });
  });

  describe("When Rendered, with flagState and a pageKey", () => {
    beforeEach(() => arrange(mockFlagState, mockPageKey));

    it("should call the HeaderContainer component correctly", async () => {
      await waitFor(() => expect(HeaderContainer).toBeCalledTimes(1));
      await waitFor(() =>
        expect(HeaderContainer).toBeCalledWith({ pageKey: mockPageKey }, {})
      );
      expect(await screen.findByTestId(providers.HeaderContainer)).toBeTruthy;
    });

    it("should initialize the AuthVendorProvider", async () => {
      await waitFor(() => expect(mockAuthProvider).toBeCalledTimes(1));
      checkMockCall(mockAuthProvider, { session: mockSession });
      expect(await screen.findByTestId(providers.AuthVendorProvider))
        .toBeTruthy;
    });

    it("should initialize the FlagVendorProvider", async () => {
      await waitFor(() => expect(flagVendor.Provider).toBeCalledTimes(1));
      await waitFor(() =>
        checkMockCall(flagVendor.Provider, {
          state: mockFlagState,
        })
      );
      expect(await screen.findByTestId(providers.FlagVendorProvider))
        .toBeTruthy;
    });

    it("should initialize the Analytics collection Provider", async () => {
      await waitFor(() =>
        expect(analyticsVendor.collection.Provider).toBeCalledTimes(1)
      );
      expect(await screen.findByTestId(providers.AnalyticsProvider)).toBeTruthy;
    });

    it("should initialize the ControllersRootProvider Provider", async () => {
      await waitFor(() => expect(ControllersRootProvider).toBeCalledTimes(1));
      expect(await screen.findByTestId(providers.ControllersRootProvider))
        .toBeTruthy;
    });

    it("should initialize the MetricsProvider", async () => {
      await waitFor(() => expect(MetricsProvider).toBeCalledTimes(1));
      expect(await screen.findByTestId(providers.MetricsProvider)).toBeTruthy;
    });

    it("should initialize the ReportProvider", async () => {
      await waitFor(() => expect(ReportProvider).toBeCalledTimes(1));
      expect(await screen.findByTestId(providers.ReportProvider)).toBeTruthy;
    });

    it("should initialize the UserInterfacePopUpsProvider", async () => {
      await waitFor(() =>
        expect(uiFrameworkVendor.popups.Provider).toBeCalledTimes(1)
      );
      checkMockCall(uiFrameworkVendor.popups.Provider, { popUps: popUps });
      expect(await screen.findByTestId(providers.UserInterfacePopUpsProvider))
        .toBeTruthy;
    });

    it("should initialize the UserInterfaceVendorProvider", async () => {
      await waitFor(() =>
        expect(uiFrameworkVendor.core.Provider).toBeCalledTimes(1)
      );
      checkMockCall(uiFrameworkVendor.core.Provider, { cookies: mockCookies });
      expect(await screen.findByTestId(providers.UserInterfaceVendorProvider))
        .toBeTruthy;
    });

    it("should display the RootProvider's Child Elements", async () => {
      expect(await screen.findByTestId(providers.RootProvider)).toBeTruthy;
    });
  });
});
