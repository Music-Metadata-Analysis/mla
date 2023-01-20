import { render, screen } from "@testing-library/react";
import AuthenticationErrorConditionalDisplay from "../authentication.error.display.class.component";
import Authentication from "@src/components/authentication/authentication.container";
import { MockReportClass } from "@src/components/reports/lastfm/common/report.class/tests/implementations/concrete.sunburst.report.class";
import MockStage2Report from "@src/providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/tests/fixtures/user.state.playcount.by.artist.sunburst.stage.2.json";
import mockRouterHook from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";
import type { LastFMUserStateBase } from "@src/types/user/state.types";

jest.mock("@src/components/authentication/authentication.container", () =>
  require("@fixtures/react/parent").createComponent("AuthenticationContainer")
);

describe("AuthenticationErrorConditionalDisplay", () => {
  let mockUserProperties: LastFMUserStateBase;
  let mockReport: MockReportClass;
  const errorType = "UnauthorizedFetch";

  beforeEach(() => {
    mockUserProperties = JSON.parse(JSON.stringify(MockStage2Report));
    mockReport = new MockReportClass();
  });

  const arrange = () => {
    render(
      <AuthenticationErrorConditionalDisplay
        router={mockRouterHook}
        report={mockReport}
        userProperties={mockUserProperties}
      />
    );
  };

  describe("when userProperties prop has a matching error", () => {
    beforeEach(() => (mockUserProperties.error = errorType));

    describe("when instantiated with a concrete implementation", () => {
      beforeEach(() => arrange());

      it("should render the auth component", async () => {
        expect(
          await screen.findByTestId("AuthenticationContainer")
        ).toBeTruthy();
      });

      it("should render with the correct props", async () => {
        expect(Authentication).toBeCalledWith({}, {});
      });
    });
  });

  describe("when userProperties prop has a non matching error", () => {
    beforeEach(() => (mockUserProperties.error = "DataPointFailureFetch"));

    describe("when instantiated with a concrete implementation", () => {
      beforeEach(() => arrange());

      it("should NOT render the auth component", async () => {
        expect(screen.queryByTestId("AuthenticationContainer")).toBeFalsy();
      });

      it("should render with the correct props", async () => {
        expect(Authentication).toBeCalledWith({}, {});
      });
    });
  });
});
