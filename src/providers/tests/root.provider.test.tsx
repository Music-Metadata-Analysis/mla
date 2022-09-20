import { waitFor, screen, render } from "@testing-library/react";
import authVendor from "../../clients/auth/vendor";
import flagVendor from "../../clients/flags/vendor";
import Header from "../../components/header/header.component";
import checkMockCall from "../../tests/fixtures/mock.component.call";
import AnalyticsProvider from "../analytics/analytics.provider";
import MetricsProvider from "../metrics/metrics.provider";
import NavBarProvider from "../navbar/navbar.provider";
import RootProvider from "../root.provider";
import UserInterfaceRootProvider from "../ui/ui.root.provider";
import UserProvider from "../user/user.provider";
import type { VendorAuthStateType } from "../../clients/auth/vendor.types";
import type { VendorFlagStateType } from "../../clients/flags/vendor.types";

jest.mock("../../clients/auth/vendor", () => ({
  Provider: createProviderMock(providers.AuthVendorProvider, "Provider")[
    "Provider"
  ],
}));

jest.mock("../../clients/flags/vendor", () => ({
  Provider: createProviderMock(providers.FlagVendorProvider, "Provider")[
    "Provider"
  ],
}));

jest.mock("../../components/header/header.component", () =>
  createProviderMock(providers.Header)
);

jest.mock("../../providers/analytics/analytics.provider", () =>
  createProviderMock(providers.AnalyticsProvider)
);

jest.mock("../../providers/metrics/metrics.provider", () =>
  createProviderMock(providers.MetricsProvider)
);

jest.mock("../../providers/navbar/navbar.provider", () =>
  createProviderMock(providers.NavBarProvider)
);

jest.mock("../../providers/user/user.provider", () =>
  createProviderMock(providers.UserProvider)
);

jest.mock("../ui/ui.root.provider", () =>
  createProviderMock(providers.UserInterfaceRootProvider)
);

const createProviderMock = (name: string, exportName = "default") => {
  const {
    factoryInstance,
  } = require("../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name, exportName);
};

const providers = {
  AnalyticsProvider: "AnalyticsProvider",
  AuthVendorProvider: "AuthVendorProvider",
  FlagVendorProvider: "FlagVendorProvider",
  Header: "Header",
  MetricsProvider: "MetricsProvider",
  NavBarProvider: "NavBarProvider",
  RootProvider: "RootProvider",
  UserProvider: "UserProvider",
  UserInterfaceRootProvider: "UserInterfaceRootProvider",
};

describe("RootProvider", () => {
  const mockPageKey = "test";
  const mockServerState = {
    api: "unknown",
    environmentID: "unknown",
    flags: {},
    identity: "unknown",
    traits: {},
  };
  const mockSession = {
    testSession: true,
  } as unknown as VendorAuthStateType;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = async (pageKey?: string, flagState?: VendorFlagStateType) => {
    const headerProps = pageKey ? { pageKey } : undefined;
    const serverState = flagState ? flagState : undefined;
    render(
      <RootProvider
        session={mockSession}
        headerProps={headerProps}
        flagState={serverState}
      >
        <div data-testid={providers.RootProvider}>Test</div>
      </RootProvider>
    );
  };

  describe("When Rendered, without a pageKey or flagState", () => {
    beforeEach(() => arrange());

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
          state: undefined,
        })
      );
      expect(await screen.findByTestId(providers.FlagVendorProvider))
        .toBeTruthy;
    });
  });

  describe("When Rendered, with a pageKey and flagsmithState", () => {
    beforeEach(() => arrange(mockPageKey, mockServerState));

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
          state: mockServerState,
        })
      );
      expect(await screen.findByTestId(providers.FlagVendorProvider))
        .toBeTruthy;
    });

    it("should initialize the Analytics Provider", async () => {
      await waitFor(() => expect(AnalyticsProvider).toBeCalledTimes(1));
      expect(await screen.findByTestId(providers.AnalyticsProvider)).toBeTruthy;
    });

    it("should initialize the MetricsProvider", async () => {
      await waitFor(() => expect(MetricsProvider).toBeCalledTimes(1));
      expect(await screen.findByTestId(providers.MetricsProvider)).toBeTruthy;
    });

    it("should initialize the NavBar Provider", async () => {
      await waitFor(() => expect(NavBarProvider).toBeCalledTimes(1));
      expect(await screen.findByTestId(providers.NavBarProvider)).toBeTruthy;
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
