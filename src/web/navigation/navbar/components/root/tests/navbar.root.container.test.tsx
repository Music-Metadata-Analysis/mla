import { render } from "@testing-library/react";
import NavBarRoot from "../navbar.root.component";
import NavBarRootContainer from "../navbar.root.container";
import NavConfig from "@src/config/navbar";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockAnalyticsCollectionHook from "@src/web/analytics/collection/state/hooks/__mocks__/analytics.hook.mock";
import mockAuthHook from "@src/web/authentication/session/hooks/__mocks__/auth.hook.mock";
import { MockUseTranslation } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";
import mockControllerHook from "@src/web/navigation/navbar/state/controllers/__mocks__/navbar.layout.controller.hook.mock";
import mockRouterHook from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";
import mockLastFMHook from "@src/web/reports/lastfm/generics/state/hooks/__mocks__/lastfm.hook.mock";

jest.mock("@src/web/analytics/collection/state/hooks/analytics.hook");

jest.mock("@src/web/authentication/session/hooks/auth.hook");

jest.mock("@src/web/reports/lastfm/generics/state/hooks/lastfm.hook");

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock("@src/web/navigation/routing/hooks/router.hook");

jest.mock("../navbar.root.component", () =>
  require("@fixtures/react/child").createComponent(["NavBarRoot"])
);

describe("NavBarRootContainer", () => {
  const mockNavBarT = new MockUseTranslation("navbar").t;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useTranslation).mockReturnValueOnce({ t: mockNavBarT });
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
        expect(NavBarRoot).toHaveBeenCalledTimes(1);
        checkMockCall(
          NavBarRoot,
          {
            analytics: {
              trackButtonClick: mockAnalyticsCollectionHook.trackButtonClick,
            },
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

  describe("when the user report state is NOT inProgress", () => {
    beforeEach(() => (mockLastFMHook.reportProperties.inProgress = false));

    describe("when the authState is 'processing'", () => {
      beforeEach(() => (mockAuthHook.status = "processing"));

      checkNavBar({ expectedTransactionValue: true });
    });

    describe("when the authState is NOT 'processing'", () => {
      beforeEach(() => (mockAuthHook.status = "authenticated"));

      checkNavBar({ expectedTransactionValue: false });
    });
  });

  describe("when the user report state is inProgress", () => {
    beforeEach(() => (mockLastFMHook.reportProperties.inProgress = true));

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
