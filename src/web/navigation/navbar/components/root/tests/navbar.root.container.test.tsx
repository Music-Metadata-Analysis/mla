import { render } from "@testing-library/react";
import NavBarRoot from "../navbar.root.component";
import NavBarRootContainer from "../navbar.root.container";
import NavConfig from "@src/config/navbar";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockAuthHook from "@src/hooks/__mocks__/auth.hook.mock";
import mockLastFMHook from "@src/hooks/__mocks__/lastfm.hook.mock";
import { MockUseLocale } from "@src/hooks/__mocks__/locale.hook.mock";
import useLocale from "@src/hooks/locale.hook";
import mockAnalyticsHook from "@src/web/analytics/collection/state/hooks/__mocks__/analytics.hook.mock";
import mockControllerHook from "@src/web/navigation/navbar/state/controllers/__mocks__/navbar.layout.controller.hook.mock";
import mockRouterHook from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";

jest.mock("@src/web/analytics/collection/state/hooks/analytics.hook");

jest.mock("@src/hooks/auth.hook");

jest.mock("@src/hooks/lastfm.hook");

jest.mock("@src/hooks/locale.hook");

jest.mock("@src/web/navigation/routing/hooks/router.hook");

jest.mock("../navbar.root.component", () =>
  require("@fixtures/react/child").createComponent(["NavBarRoot"])
);

describe("NavBarRootContainer", () => {
  const mockNavBarT = new MockUseLocale("navbar").t;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useLocale).mockReturnValueOnce({ t: mockNavBarT });
  });

  const arrange = () => {
    render(
      <NavBarRootContainer
        config={NavConfig.menuConfig}
        controller={mockControllerHook}
      />
    );
  };

  const checkNavBar = ({
    expectedTransactionValue,
  }: {
    expectedTransactionValue: boolean;
  }) => {
    describe("when rendered", () => {
      beforeEach(() => arrange());

      it("should render the NavBarRoot with the correct props", () => {
        expect(NavBarRoot).toBeCalledTimes(1);
        checkMockCall(
          NavBarRoot,
          {
            analytics: { trackButtonClick: mockAnalyticsHook.trackButtonClick },
            controls: mockControllerHook.controls,
            config: NavConfig.menuConfig,
            navBarT: mockNavBarT,
            transaction: expectedTransactionValue,
            router: { path: mockRouterHook.path },
            rootReference: mockControllerHook.rootReference,
            user: {
              name: mockAuthHook.user?.name,
              image: mockAuthHook.user?.image,
            },
          },
          0
        );
      });
    });
  };

  describe("when the user report state is ready", () => {
    beforeEach(() => (mockLastFMHook.userProperties.ready = true));

    describe("when the authState is 'processing'", () => {
      beforeEach(() => (mockAuthHook.status = "processing"));

      checkNavBar({ expectedTransactionValue: true });
    });

    describe("when the authState is NOT 'processing'", () => {
      beforeEach(() => (mockAuthHook.status = "authenticated"));

      checkNavBar({ expectedTransactionValue: false });
    });
  });

  describe("when the user report state is NOT ready", () => {
    beforeEach(() => (mockLastFMHook.userProperties.ready = false));

    describe("when the authState is 'processing'", () => {
      beforeEach(() => (mockAuthHook.status = "processing"));

      checkNavBar({ expectedTransactionValue: true });
    });

    describe("when the authState is NOT 'processing'", () => {
      beforeEach(() => (mockAuthHook.status = "authenticated"));

      checkNavBar({ expectedTransactionValue: true });
    });
  });
});
