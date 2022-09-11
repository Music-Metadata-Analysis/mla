import { waitFor, screen, render } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import flagVendor from "../../clients/flags/vendor";
import Header from "../../components/header/header.component";
import checkMockCall from "../../tests/fixtures/mock.component.call";
import AnalyticsProvider from "../analytics/analytics.provider";
import MetricsProvider from "../metrics/metrics.provider";
import NavBarProvider from "../navbar/navbar.provider";
import RootProvider from "../root.provider";
import UserInterfaceRootProvider from "../ui/ui.root.provider";
import UserProvider from "../user/user.provider";
import type { VendorFlagStateType } from "../../clients/flags/vendor.types";

jest.mock("../../clients/flags/vendor", () => {
  const provider = createProviderMock(providers.FlagVendorProvider, "Provider");
  return {
    __esModule: true,
    default: {
      Provider: provider["Provider"],
    },
  };
});

jest.mock("next-auth/react", () =>
  createProviderMock(providers.SessionProvider, "SessionProvider")
);

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
  FlagVendorProvider: "FlagVendorProvider",
  Header: "Header",
  MetricsProvider: "MetricsProvider",
  NavBarProvider: "NavBarProvider",
  RootProvider: "RootProvider",
  SessionProvider: "SessionProvider",
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
    expires: new Date(Date.now() + 1000).toISOString(),
  };
  let originalEnvironment: typeof process.env;
  const mockFlagSmithEnvironment = "environment_identifier_token";

  beforeAll(() => {
    originalEnvironment = process.env;
    process.env.NEXT_PUBLIC_FLAG_ENVIRONMENT = mockFlagSmithEnvironment;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnvironment;
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

    it("should initialize the SessionProvider", async () => {
      await waitFor(() => expect(SessionProvider).toBeCalledTimes(1));
      checkMockCall(SessionProvider, { session: mockSession });
      expect(await screen.findByTestId(providers.SessionProvider)).toBeTruthy;
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

    it("should display the RootProvider's Child Elements", async () => {
      expect(await screen.findByTestId(providers.RootProvider)).toBeTruthy;
    });
  });
});
