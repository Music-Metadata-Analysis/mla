import { render, screen } from "@testing-library/react";
import App from "next/app";
import { createSimpleComponent } from "@fixtures/react/simple";
import NavConfig from "@src/config/navbar";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import MLA, { getInitialProps } from "@src/pages/_app";
import { normalizeUndefined } from "@src/utilities/generics/voids";
import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";
import { mockAuthVendorSSRClient } from "@src/vendors/integrations/auth/__mocks__/vendor.ssr.mock";
import { authVendorSSR } from "@src/vendors/integrations/auth/vendor.ssr";
import { mockFlagVendorSSRClient } from "@src/vendors/integrations/flags/__mocks__/vendor.ssr.mock";
import { flagVendorSSR } from "@src/vendors/integrations/flags/vendor.ssr";
import { mockLocaleVendorHOCIdentifier } from "@src/vendors/integrations/locale/__mocks__/vendor.mock";
import NavBarContainer from "@src/web/navigation/navbar/components/navbar.container";
import RootPopUpContainer from "@src/web/notifications/popups/components/root.popup.container";
import RootProvider from "@src/web/ui/generics/state/providers/root.provider";
import type { MLAProps } from "@src/pages/_app";
import type { AuthVendorStateType } from "@src/vendors/types/integrations/auth/vendor.types";
import type { FlagVendorStateInterface } from "@src/vendors/types/integrations/flags/vendor.types";
import type { WebFrameworkVendorAppComponentProps } from "@src/vendors/types/integrations/web.framework/vendor.types";
import type { AppContext } from "next/app";
import type { Router } from "next/router";

jest.mock("@src/vendors/integrations/analytics/vendor");

jest.mock("@src/vendors/integrations/auth/vendor.ssr");

jest.mock("@src/vendors/integrations/flags/vendor.ssr");

jest.mock("@src/vendors/integrations/locale/vendor");

jest.mock("@src/utilities/generics/voids");

jest.mock("@src/web/analytics/collection/state/hooks/analytics.hook");

jest.mock("next/app");

jest.mock("@src/web/ui/generics/state/providers/root.provider", () =>
  require("@fixtures/react/parent").createComponent("RootProvider")
);

jest.mock("@src/web/navigation/navbar/components/navbar.container", () =>
  require("@fixtures/react/child").createComponent("NavBarContainer")
);

jest.mock("@src/web/notifications/popups/components/root.popup.container", () =>
  require("@fixtures/react/child").createComponent("RootPopUpContainer")
);

describe("MLA", () => {
  let currentProps: WebFrameworkVendorAppComponentProps<MLAProps>;
  const MockAppChildComponent = createSimpleComponent("MockAppChildComponent");

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const createProps = () => {
    currentProps = {
      Component: MockAppChildComponent,
      pageProps: {
        cookies: "mockCookies",
        flagState: {
          identity: "mockIdentity",
          serverState: {
            api: "mockAPI",
            environmentID: "mockEnvironmentID",
            traits: {},
          },
        },
        session: { expires: "mockExpiry" },
        headerProps: { pageKey: "mockPageKey" },
      },
      router: {} as Router,
    };
  };

  const arrange = () => {
    createProps();
    render(<MLA {...currentProps} />);
  };

  it("should render the RootProvider with the correct props", () => {
    expect(RootProvider).toHaveBeenCalledTimes(1);
    checkMockCall(RootProvider, {
      cookies: currentProps.pageProps.cookies,
      flagState: currentProps.pageProps.flagState,
      session: currentProps.pageProps.session,
      headerProps: currentProps.pageProps.headerProps,
    });
  });

  it("should render the NavBarContainer with the correct props", () => {
    expect(NavBarContainer).toHaveBeenCalledTimes(1);
    checkMockCall(NavBarContainer, { config: NavConfig.menuConfig });
  });

  it("should render the passed Component with the correct props", () => {
    expect(currentProps.Component).toHaveBeenCalledTimes(1);
    checkMockCall(currentProps.Component, {});
  });

  it("should render the RootPopUpContainer component with the correct props", () => {
    expect(RootPopUpContainer).toHaveBeenCalledTimes(1);
    checkMockCall(RootPopUpContainer, {});
  });

  it("should render the ConsentBannerComponent component with the correct props", () => {
    expect(
      analyticsVendor.collection.ConsentBannerComponent
    ).toHaveBeenCalledTimes(1);
    checkMockCall(analyticsVendor.collection.ConsentBannerComponent, {});
  });

  it("should wrap the MLA app in the appWithTranslation function", async () => {
    expect(
      await screen.findByTestId(mockLocaleVendorHOCIdentifier)
    ).toBeTruthy();
  });

  describe("getInitialProps", () => {
    let result: {
      pageProps: {
        cookies?: unknown;
        pageProps: unknown;
        session: AuthVendorStateType | undefined;
        flagState: FlagVendorStateInterface;
      };
    };
    const mockRequest = "mockRequest";
    const mockContext = {
      ctx: { req: mockRequest },
    } as unknown as AppContext;
    const mockSession = { group: "mockGroup" };
    const mockFlagState = "mockFlagState";
    const mockExtraProps = { pageProps: "mockPageProp" };

    describe("with an authorized user", () => {
      beforeEach(async () => {
        jest.mocked(App.getInitialProps).mockResolvedValueOnce(mockExtraProps);
        mockAuthVendorSSRClient.getSession.mockReturnValue(mockSession);
        mockFlagVendorSSRClient.getState.mockReturnValue(mockFlagState);

        result = await getInitialProps(mockContext);
      });

      it("should call App.getInitialProps as expected", () => {
        expect(App.getInitialProps).toHaveBeenCalledTimes(1);
        expect(App.getInitialProps).toHaveBeenCalledWith(mockContext);
      });

      it("should call the authVendor's SSR Client getSession method as expected", () => {
        expect(authVendorSSR.Client).toHaveBeenCalledTimes(1);
        expect(authVendorSSR.Client).toHaveBeenCalledWith();
        expect(mockAuthVendorSSRClient.getSession).toHaveBeenCalledTimes(1);
        expect(mockAuthVendorSSRClient.getSession).toHaveBeenCalledWith({
          req: mockRequest,
        });
      });

      it("should call the flagVendor's SSR Client getState method as expected", () => {
        expect(flagVendorSSR.Client).toHaveBeenCalledTimes(1);
        expect(flagVendorSSR.Client).toHaveBeenCalledWith();
        expect(mockFlagVendorSSRClient.getState).toHaveBeenCalledTimes(1);
        expect(mockFlagVendorSSRClient.getState).toHaveBeenCalledWith(
          mockSession.group
        );
      });

      it("should wrap the session in a normalizeUndefined call", () => {
        expect(normalizeUndefined).toHaveBeenCalledTimes(1);
        expect(normalizeUndefined).toHaveBeenCalledWith(mockSession);
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

    describe("with an unauthorized user", () => {
      beforeEach(async () => {
        jest.mocked(App.getInitialProps).mockResolvedValueOnce(mockExtraProps);
        mockAuthVendorSSRClient.getSession.mockReturnValue(null);
        mockFlagVendorSSRClient.getState.mockReturnValue(mockFlagState);

        result = await getInitialProps(mockContext);
      });

      it("should call App.getInitialProps as expected", () => {
        expect(App.getInitialProps).toHaveBeenCalledTimes(1);
        expect(App.getInitialProps).toHaveBeenCalledWith(mockContext);
      });

      it("should call the authVendor's SSR Client getSession method as expected", () => {
        expect(authVendorSSR.Client).toHaveBeenCalledTimes(1);
        expect(authVendorSSR.Client).toHaveBeenCalledWith();
        expect(mockAuthVendorSSRClient.getSession).toHaveBeenCalledTimes(1);
        expect(mockAuthVendorSSRClient.getSession).toHaveBeenCalledWith({
          req: mockRequest,
        });
      });

      it("should call the flagVendor's SSR Client getState method as expected", () => {
        expect(flagVendorSSR.Client).toHaveBeenCalledTimes(1);
        expect(flagVendorSSR.Client).toHaveBeenCalledWith();
        expect(mockFlagVendorSSRClient.getState).toHaveBeenCalledTimes(1);
        expect(mockFlagVendorSSRClient.getState).toHaveBeenCalledWith(
          undefined
        );
      });

      it("should wrap the session in a normalizeUndefined call", () => {
        expect(normalizeUndefined).toHaveBeenCalledTimes(1);
        expect(normalizeUndefined).toHaveBeenCalledWith(null);
      });

      it("should return the expected values", () => {
        expect(result).toStrictEqual({
          pageProps: {
            flagState: mockFlagState,
            session: `normalizeUndefined(null)`,
            ...mockExtraProps,
          },
        });
      });
    });
  });
});
