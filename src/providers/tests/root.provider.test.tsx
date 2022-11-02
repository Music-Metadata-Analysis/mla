import { waitFor, screen, render } from "@testing-library/react";
import ControllersRootProvider from "../controllers/controllers.root.provider";
import MetricsProvider from "../metrics/metrics.provider";
import RootProvider from "../root.provider";
import UserInterfaceRootProvider from "../ui/ui.root.provider";
import UserProvider from "../user/user.provider";
import authVendor from "@src/clients/auth/vendor";
import flagVendor from "@src/clients/flags/vendor";
import Header from "@src/components/header/header.component";
import AnalyticsProvider from "@src/providers/analytics/analytics.provider";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import type { VendorAuthStateType } from "@src/clients/auth/vendor.types";
import type { VendorFlagStateType } from "@src/clients/flags/vendor.types";

jest.mock("@src/clients/auth/vendor");

jest.mock("@src/clients/flags/vendor");

jest.mock("@src/components/header/header.component", () =>
  require("@fixtures/react/parent").createComponent("Header")
);

jest.mock("@src/providers/analytics/analytics.provider", () =>
  require("@fixtures/react/parent").createComponent("AnalyticsProvider")
);

jest.mock("@src/providers/controllers/controllers.root.provider.tsx", () =>
  require("@fixtures/react/parent").createComponent("ControllersRootProvider")
);

jest.mock("@src/providers/metrics/metrics.provider", () =>
  require("@fixtures/react/parent").createComponent("MetricsProvider")
);

jest.mock("@src/providers/user/user.provider", () =>
  require("@fixtures/react/parent").createComponent("UserProvider")
);

jest.mock("../ui/ui.root.provider", () =>
  require("@fixtures/react/parent").createComponent("UserInterfaceRootProvider")
);

const providers = {
  AnalyticsProvider: "AnalyticsProvider",
  AuthVendorProvider: "AuthVendorProvider",
  ControllersRootProvider: "ControllersRootProvider",
  FlagVendorProvider: "FlagVendorProvider",
  Header: "Header",
  MetricsProvider: "MetricsProvider",
  RootProvider: "RootProvider",
  UserProvider: "UserProvider",
  UserInterfaceRootProvider: "UserInterfaceRootProvider",
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
  } as unknown as VendorAuthStateType;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = async (flagState: VendorFlagStateType, pageKey?: string) => {
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

    it("should call the Header component correctly", async () => {
      await waitFor(() => expect(Header).toBeCalledTimes(1));
      await waitFor(() =>
        expect(Header).toBeCalledWith({ pageKey: "default" }, {})
      );
      expect(await screen.findByTestId(providers.Header)).toBeTruthy;
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

    it("should call the Header component correctly", async () => {
      await waitFor(() => expect(Header).toBeCalledTimes(1));
      await waitFor(() =>
        expect(Header).toBeCalledWith({ pageKey: mockPageKey }, {})
      );
      expect(await screen.findByTestId(providers.Header)).toBeTruthy;
    });

    it("should initialize the AuthVendorProvider", async () => {
      await waitFor(() => expect(authVendor.Provider).toBeCalledTimes(1));
      checkMockCall(authVendor.Provider, { session: mockSession });
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

    it("should initialize the UserInterfaceProvider", async () => {
      await waitFor(() => expect(UserInterfaceRootProvider).toBeCalledTimes(1));
      expect(await screen.findByTestId(providers.UserInterfaceRootProvider))
        .toBeTruthy;
    });

    it("should display the RootProvider's Child Elements", async () => {
      expect(await screen.findByTestId(providers.RootProvider)).toBeTruthy;
    });
  });
});
