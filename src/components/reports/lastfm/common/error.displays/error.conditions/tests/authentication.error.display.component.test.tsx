import { render, screen } from "@testing-library/react";
import MockStage2Report from "../../../../../../../providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/tests/fixtures/user.state.playcount.by.artist.sunburst.stage.2.json";
import mockRouter from "../../../../../../../tests/fixtures/mock.router";
import Authentication from "../../../../../../authentication/authentication.container";
import { MockReportClass } from "../../../sunburst.report/tests/fixtures/mock.sunburst.report.class";
import AuthenticationErrorConditionalDisplay from "../authentication.error.display.component";
import type { LastFMUserStateBase } from "../../../../../../../types/user/state.types";

jest.mock("../../../../../../authentication/authentication.container", () =>
  createMockedComponent("MockComponent")
);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require(".../../../../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

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
        router={mockRouter}
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
        expect(await screen.findByTestId("MockComponent")).toBeTruthy();
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
        expect(screen.queryByTestId("MockComponent")).toBeFalsy();
      });

      it("should render with the correct props", async () => {
        expect(Authentication).toBeCalledWith({}, {});
      });
    });
  });
});
