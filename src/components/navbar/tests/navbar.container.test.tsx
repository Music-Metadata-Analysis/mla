import { render } from "@testing-library/react";
import NavBarContainer from "../navbar.container";
import mockControllerHook from "../navbar.controllers/__mocks__/navbar.ui.controller.mock";
import NavBarRootContainer from "../navbar.root/navbar.root.container";
import { mockIsBuildTime } from "@src/clients/web.framework/__mocks__/vendor.mock";
import NavConfig from "@src/config/navbar";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/hooks/auth");

jest.mock("@src/hooks/lastfm");

jest.mock("../navbar.controllers/navbar.ui.controller");

jest.mock("@src/clients/web.framework/vendor");

jest.mock("../navbar.root/navbar.root.container", () =>
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
          controller: mockControllerHook,
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
        mockControllerHook.controls.navigation.state = true;

        arrange();
      });

      checkNotRendered();
    });

    describe("when navigation is NOT enabled", () => {
      beforeEach(() => {
        mockControllerHook.controls.navigation.state = false;

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
        mockControllerHook.controls.navigation.state = true;

        arrange();
      });

      checkRendered();
    });

    describe("when navigation is NOT enabled", () => {
      beforeEach(() => {
        mockControllerHook.controls.navigation.state = false;

        arrange();
      });

      checkNotRendered();
    });
  });
});
