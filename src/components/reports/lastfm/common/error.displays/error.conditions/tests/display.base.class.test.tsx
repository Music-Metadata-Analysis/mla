import { render, screen } from "@testing-library/react";
import MockStage2Report from "../../../../../../../providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/tests/fixtures/user.state.playcount.by.artist.sunburst.stage.2.json";
import mockRouter from "../../../../../../../tests/fixtures/mock.router";
import { MockReportClass } from "../../../sunburst.report/tests/fixtures/mock.sunburst.report.class";
import ConditionalErrorDisplayBase from "../error.condition.display.base.class";
import type { PlayCountByArtistReportInterface } from "../../../../../../../types/clients/api/lastfm/response.types";
import type { AggregateBaseReportResponseInterface } from "../../../../../../../types/integrations/base.types";
import type { LastFMUserStateBase } from "../../../../../../../types/user/state.types";

class ConcreteErrorBase extends ConditionalErrorDisplayBase<
  AggregateBaseReportResponseInterface<PlayCountByArtistReportInterface[]>
> {
  error = "FailureFetch" as const;

  component() {
    return <div>ConcreteErrorBase</div>;
  }
}

describe("ConditionalErrorDisplayBase", () => {
  let mockUserProperties: LastFMUserStateBase;
  let mockReport: MockReportClass;

  beforeEach(
    () => (mockUserProperties = JSON.parse(JSON.stringify(MockStage2Report)))
  );

  const arrange = () => {
    mockReport = new MockReportClass();
    render(
      <ConcreteErrorBase
        router={mockRouter}
        report={mockReport}
        userProperties={mockUserProperties}
      />
    );
  };

  describe("when userProperties prop has a matching error", () => {
    beforeEach(() => (mockUserProperties.error = "FailureFetch"));

    describe("when instantiated with a concrete implementation", () => {
      beforeEach(() => arrange());

      it("should render the component", async () => {
        expect(await screen.findAllByText("ConcreteErrorBase")).toBeTruthy();
      });
    });
  });

  describe("when userProperties prop has a non matching error", () => {
    beforeEach(() => (mockUserProperties.error = "DataPointFailureFetch"));

    describe("when instantiated with a concrete implementation", () => {
      beforeEach(() => arrange());

      it("should NOT render the component", async () => {
        expect(screen.queryByText("ConcreteErrorBase")).toBeFalsy();
      });
    });
  });
});
