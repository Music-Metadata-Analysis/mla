import { render, screen } from "@testing-library/react";
import AuthenticationErrorConditionalDisplay from "../authentication.error.display.class.component";
import MockStage2Report from "@src/contracts/api/services/lastfm/fixtures/aggregates/playcount.by.artist/lastfm.report.state.playcount.by.artist.sunburst.stage.2.json";
import Authentication from "@src/web/authentication/sign.in/components/authentication.container";
import mockRouterHook from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";
import { MockQueryClass } from "@src/web/reports/lastfm/generics/state/queries/tests/implementations/concrete.sunburst.query.class";
import type { LastFMReportStateBase } from "@src/web/reports/lastfm/generics/types/state/providers/lastfm.report.state.types";

jest.mock(
  "@src/web/authentication/sign.in/components/authentication.container",
  () =>
    require("@fixtures/react/parent").createComponent("AuthenticationContainer")
);

describe("AuthenticationErrorConditionalDisplay", () => {
  let mockReportProperties: LastFMReportStateBase;
  let mockQuery: MockQueryClass;
  const errorType = "UnauthorizedFetch";

  beforeEach(() => {
    mockReportProperties = JSON.parse(JSON.stringify(MockStage2Report));
    mockQuery = new MockQueryClass();
  });

  const arrange = () => {
    render(
      <AuthenticationErrorConditionalDisplay
        router={mockRouterHook}
        query={mockQuery}
        reportProperties={mockReportProperties}
      />
    );
  };

  describe("when reportProperties prop has a matching error", () => {
    beforeEach(() => (mockReportProperties.error = errorType));

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

  describe("when reportProperties prop has a non matching error", () => {
    beforeEach(() => (mockReportProperties.error = "DataPointFailureFetch"));

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
