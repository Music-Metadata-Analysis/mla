import { render } from "@testing-library/react";
import mockControllerHook from "../../navbar.hooks/__mocks__/navbar.ui.controller.mock";
import NavBarRoot from "../navbar.root.component";
import NavBarRootContainer from "../navbar.root.container";
import NavConfig from "@src/config/navbar";
import mockAnalyticsHook from "@src/hooks/__mocks__/analytics.mock";
import mockAuthHook from "@src/hooks/__mocks__/auth.mock";
import mockLastFMHook from "@src/hooks/__mocks__/lastfm.mock";
import mockRouterHook from "@src/hooks/__mocks__/router.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/hooks/analytics");

jest.mock("@src/hooks/auth");

jest.mock("@src/hooks/lastfm");

jest.mock("@src/hooks/router");

jest.mock("../navbar.root.component", () =>
  require("@fixtures/react/child").createComponent(["NavBarRoot"])
);

describe("NavBarRootContainer", () => {
  beforeEach(() => jest.clearAllMocks());

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
