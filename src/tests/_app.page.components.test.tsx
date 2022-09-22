import { render, screen } from "@testing-library/react";
import App from "next/app";
import checkMockCall from "../../src/tests/fixtures/mock.component.call";
import authVendor from "../clients/auth/vendor";
import flagVendor from "../clients/flags/vendor";
import Consent from "../components/consent/consent.component";
import NavBar from "../components/navbar/navbar.component";
import RootPopup from "../components/popups/root.popup";
import NavConfig from "../config/navbar";
import MLA, { getInitialProps } from "../pages/_app";
import RootProvider from "../providers/root.provider";
import { normalizeUndefined } from "../utils/voids";
import type { VendorAuthStateType } from "../clients/auth/vendor.types";
import type { VendorFlagStateType } from "../clients/flags/vendor.types";
import type { AppContext, AppProps } from "next/app";
import type { Router } from "next/router";

jest.mock("../../src/providers/root.provider", () =>
  createMockedComponent("RootProvider")
);

jest.mock("../../src/components/navbar/navbar.component", () =>
  jest.fn(() => <div>MockNavBar</div>)
);

jest.mock("../../src/components/popups/root.popup", () =>
  jest.fn(() => <div>MockPopUpsRoot</div>)
);

jest.mock("../../src/components/consent/consent.component", () =>
  jest.fn(() => <div>MockConsentBanner</div>)
);

jest.mock("next/app", () => ({
  getInitialProps: jest.fn(),
}));

jest.mock("../clients/auth/vendor", () => ({
  SSR: jest.fn(() => ({
    getSession: mockGetSession,
  })),
}));

jest.mock("../clients/flags/vendor", () => ({
  SSR: jest.fn(() => ({
    getState: mockGetState,
  })),
}));

const mockGetSession = jest.fn();
const mockGetState = jest.fn();

jest.mock("../utils/voids", () => {
  const module = require("../utils/tests/voids.mock");
  return { normalizeUndefined: module.mockNormalizeUndefined };
});

jest.mock("next-i18next", () => {
  return {
    appWithTranslation: (Component: React.FC) =>
      jest.fn((props) => {
        return (
          <div data-testid={mockTranslationWrapper}>
            <Component {...props} />
          </div>
        );
      }),
  };
});

const mockTranslationWrapper = "mockTranslationWrapper";

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../src/tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("MLA", () => {
  let currentProps: AppProps;

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const createProps = () => {
    currentProps = {
      Component: jest.fn(() => <div>MockComponent</div>),
      pageProps: {
        flagState: "mockFlagState",
        session: "mockSession",
        headerProps: "mockHeaderProps",
        mockExtraProp: "mockExtraProp",
      },
      router: {} as Router,
    };
  };

  const arrange = () => {
    createProps();
    render(<MLA {...currentProps} />);
  };

  it("should render the RootProvider with the correct props", () => {
    expect(RootProvider).toBeCalledTimes(1);
    checkMockCall(RootProvider, {
      flagState: currentProps.pageProps.flagState,
      session: currentProps.pageProps.session,
      headerProps: currentProps.pageProps.headerProps,
    });
  });

  it("should render the NavBar with the correct props", () => {
    expect(NavBar).toBeCalledTimes(1);
    checkMockCall(NavBar, { menuConfig: NavConfig.menuConfig });
  });

  it("should render the passed Component with the correct props", () => {
    expect(currentProps.Component).toBeCalledTimes(1);
    checkMockCall(currentProps.Component, {
      mockExtraProp: currentProps.pageProps.mockExtraProp,
    });
  });

  it("should render the RootPopup component with the correct props", () => {
    expect(RootPopup).toBeCalledTimes(1);
    checkMockCall(RootPopup, {});
  });

  it("should render the Consent component with the correct props", () => {
    expect(Consent).toBeCalledTimes(1);
    checkMockCall(Consent, {});
  });

  it("should wrap the MLA app in the appWithTranslation function", async () => {
    expect(await screen.findByTestId(mockTranslationWrapper)).toBeTruthy();
  });

  describe("getInitialProps", () => {
    let result: {
      pageProps: {
        pageProps: unknown;
        session: VendorAuthStateType | undefined;
        flagState: VendorFlagStateType;
      };
    };
    const mockRequest = "mockRequest";
    const mockContext = {
      ctx: { req: mockRequest },
    } as unknown as AppContext;
    const mockSession = { group: "mockGroup" };
    const mockFlagState = "mockFlagState";
    const mockExtraProps = { mockProp: "mockProp" };

    beforeEach(async () => {
      (App.getInitialProps as jest.Mock).mockReturnValue(mockExtraProps);
      mockGetSession.mockReturnValue(mockSession);
      mockGetState.mockReturnValue(mockFlagState);

      result = await getInitialProps(mockContext);
    });

    it("should call App.getInitialProps as expected", () => {
      expect(App.getInitialProps).toBeCalledTimes(1);
      expect(App.getInitialProps).toBeCalledWith(mockContext);
    });

    it("should call the authVendor's SSR getSession method as expected", () => {
      expect(authVendor.SSR).toBeCalledTimes(1);
      expect(authVendor.SSR).toBeCalledWith();
      expect(mockGetSession).toBeCalledTimes(1);
      expect(mockGetSession).toBeCalledWith({ req: mockRequest });
    });

    it("should call the flagVendor's SSR getState method as expected", () => {
      expect(flagVendor.SSR).toBeCalledTimes(1);
      expect(flagVendor.SSR).toBeCalledWith();
      expect(mockGetState).toBeCalledTimes(1);
      expect(mockGetState).toBeCalledWith(mockSession.group);
    });

    it("should wrap the session in a normalizeUndefined call", () => {
      expect(normalizeUndefined).toBeCalledTimes(1);
      expect(normalizeUndefined).toBeCalledWith(mockSession);
    });

    it("should return the expected values", () => {
      expect(result).toStrictEqual({
        pageProps: {
          flagState: mockFlagState,
          session: `normalizeUndefined(${mockSession})`,
          ...mockExtraProps,
        },
      });
    });
  });
});
