import { render, screen } from "@testing-library/react";
import ErrorConditionBase from "../error.condition.base.class.component";
import MockStage2Report from "@src/contracts/api/services/lastfm/fixtures/aggregates/playcount.by.artist/lastfm.report.state.playcount.by.artist.sunburst.stage.2.json";
import mockRouterHook from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";
import { MockQueryClass } from "@src/web/reports/lastfm/generics/state/queries/tests/implementations/concrete.sunburst.query.class";
import type { LastFMAggregateReportResponseInterface } from "@src/contracts/api/types/services/lastfm/aggregates/lastfm.aggregate.report.types";
import type { PlayCountByArtistReportInterface } from "@src/contracts/api/types/services/lastfm/aggregates/lastfm.playcount.by.artist.report.types";
import type { LastFMSunBurstDrawerInterface } from "@src/web/reports/lastfm/generics/types/components/drawer/sunburst.types";
import type { LastFMReportStateBase } from "@src/web/reports/lastfm/generics/types/state/providers/lastfm.report.state.types";

class ConcreteErrorBase extends ErrorConditionBase<
  LastFMAggregateReportResponseInterface<PlayCountByArtistReportInterface[]>,
  LastFMSunBurstDrawerInterface
> {
  error = "FailureFetch" as const;

  component() {
    return <div>ConcreteErrorBase</div>;
  }
}

describe("ConditionalErrorDisplayBase", () => {
  let mockReportProperties: LastFMReportStateBase;
  let mockQuery: MockQueryClass;

  beforeEach(
    () => (mockReportProperties = JSON.parse(JSON.stringify(MockStage2Report)))
  );

  const arrange = () => {
    mockQuery = new MockQueryClass();
    render(
      <ConcreteErrorBase
        router={mockRouterHook}
        query={mockQuery}
        reportProperties={mockReportProperties}
      />
    );
  };

  describe("when reportProperties prop has a matching error", () => {
    beforeEach(() => (mockReportProperties.error = "FailureFetch"));

    describe("when instantiated with a concrete implementation", () => {
      beforeEach(() => arrange());

      it("should render the component", async () => {
        expect(await screen.findAllByText("ConcreteErrorBase")).toBeTruthy();
      });
    });
  });

  describe("when reportProperties prop has a non matching error", () => {
    beforeEach(() => (mockReportProperties.error = "DataPointFailureFetch"));

    describe("when instantiated with a concrete implementation", () => {
      beforeEach(() => arrange());

      it("should NOT render the component", async () => {
        expect(screen.queryByText("ConcreteErrorBase")).toBeFalsy();
      });
    });
  });
});
