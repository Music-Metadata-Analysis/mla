import { render } from "@testing-library/react";
import NavBarContainer from "../navbar.container";
import NavBarRootContainer from "../root/navbar.root.container";
import NavConfig from "@src/config/navbar";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { mockIsBuildTime } from "@src/vendors/integrations/web.framework/__mocks__/vendor.mock";
import mockNavBarLayoutControllerHook from "@src/web/navigation/navbar/state/controllers/__mocks__/navbar.layout.controller.hook.mock";

jest.mock("@src/web/authentication/session/hooks/auth.hook");

jest.mock("@src/hooks/lastfm.hook");

jest.mock(
  "@src/web/navigation/navbar/state/controllers/navbar.layout.controller.hook"
);

jest.mock("@src/vendors/integrations/web.framework/vendor");

jest.mock("../root/navbar.root.container", () =>
  require("@fixtures/react/child").createComponent(["NavBarRootContainer"])
);

describe("NavBarContainer", () => {
  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(<NavBarContainer config={NavConfig.menuConfig} />);
  };

  const checkNotRendered = () => {
    it("should NOT render the NavBarRootContainer", () => {
      expect(NavBarRootContainer).toBeCalledTimes(0);
    });
  };
  const checkRendered = () => {
    it("should render the NavBarRootContainer with the correct props", () => {
      expect(NavBarRootContainer).toBeCalledTimes(1);
      checkMockCall(
        NavBarRootContainer,
        {
          config: NavConfig.menuConfig,
          controller: mockNavBarLayoutControllerHook,
        },
        0
      );
    });
  };

  describe("when it is build time", () => {
    beforeEach(() => {
      mockIsBuildTime.mockReturnValue(true);
    });

    describe("when navigation is enabled", () => {
      beforeEach(() => {
        mockNavBarLayoutControllerHook.controls.navigation.state = true;

        arrange();
      });

      checkNotRendered();
    });

    describe("when navigation is NOT enabled", () => {
      beforeEach(() => {
        mockNavBarLayoutControllerHook.controls.navigation.state = false;

        arrange();
      });

      checkNotRendered();
    });
  });

  describe("when it is NOT build time", () => {
    beforeEach(() => {
      mockIsBuildTime.mockReturnValue(false);
    });

    describe("when navigation is enabled", () => {
      beforeEach(() => {
        mockNavBarLayoutControllerHook.controls.navigation.state = true;

        arrange();
      });

      checkRendered();
    });

    describe("when navigation is NOT enabled", () => {
      beforeEach(() => {
        mockNavBarLayoutControllerHook.controls.navigation.state = false;

        arrange();
      });

      checkNotRendered();
    });
  });
});
