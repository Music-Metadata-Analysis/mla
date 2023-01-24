import { waitFor, screen, render } from "@testing-library/react";
import ControllersRootProvider from "../controllers/controllers.root.provider";
import RootProvider from "../root.provider";
import UserProvider from "../user/user.provider";
import HeaderContainer from "@src/components/header/header.container";
import { popUps } from "@src/config/popups";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { mockAuthProvider } from "@src/vendors/integrations/auth/__mocks__/vendor.mock";
import { flagVendor } from "@src/vendors/integrations/flags/vendor";
import { uiFrameworkVendor } from "@src/vendors/integrations/ui.framework/vendor";
import AnalyticsProvider from "@src/web/analytics/collection/state/providers/analytics.provider";
import MetricsProvider from "@src/web/metrics/collection/state/providers/metrics.provider";
import type { AuthVendorStateType } from "@src/vendors/types/integrations/auth/vendor.types";
import type { FlagVendorStateInterface } from "@src/vendors/types/integrations/flags/vendor.types";

jest.mock("@src/vendors/integrations/auth/vendor");

jest.mock("@src/vendors/integrations/flags/vendor");

jest.mock("@src/vendors/integrations/ui.framework/vendor");

jest.mock("@src/components/header/header.container", () =>
  require("@fixtures/react/parent").createComponent("HeaderContainer")
);

jest.mock(
  "@src/web/analytics/collection/state/providers/analytics.provider",
  () => require("@fixtures/react/parent").createComponent("AnalyticsProvider")
);

jest.mock("@src/providers/controllers/controllers.root.provider.tsx", () =>
  require("@fixtures/react/parent").createComponent("ControllersRootProvider")
);

jest.mock("@src/web/metrics/collection/state/providers/metrics.provider", () =>
  require("@fixtures/react/parent").createComponent("MetricsProvider")
);

jest.mock("@src/providers/user/user.provider", () =>
  require("@fixtures/react/parent").createComponent("UserProvider")
);

const providers = {
  AnalyticsProvider: "AnalyticsProvider",
  AuthVendorProvider: "AuthVendorProvider",
  ControllersRootProvider: "ControllersRootProvider",
  FlagVendorProvider: "FlagVendorProvider",
  HeaderContainer: "HeaderContainer",
  MetricsProvider: "MetricsProvider",
  RootProvider: "RootProvider",
  UserInterfacePopUpsProvider: "UserInterfacePopUpsProvider",
  UserInterfaceVendorProvider: "UserInterfaceVendorProvider",
  UserProvider: "UserProvider",
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

    it("should initialize the Analytics Provider", async () => {
      await waitFor(() => expect(AnalyticsProvider).toBeCalledTimes(1));
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

    it("should initialize the UserProvider", async () => {
      await waitFor(() => expect(UserProvider).toBeCalledTimes(1));
      expect(await screen.findByTestId(providers.UserProvider)).toBeTruthy;
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
