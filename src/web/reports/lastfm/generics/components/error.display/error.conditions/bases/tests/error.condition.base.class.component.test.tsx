import { render, screen } from "@testing-library/react";
import ErrorConditionBase from "../error.condition.base.class.component";
import mockRouterHook from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";
import MockStage2Report from "@src/web/reports/generics/state/providers/encapsulations/lastfm/sunburst/playcount.by.artist/tests/fixtures/user.state.playcount.by.artist.sunburst.stage.2.json";
import { MockReportClass } from "@src/web/reports/lastfm/generics/state/queries/tests/implementations/concrete.sunburst.query.class";
import type { LastFMUserStateBase } from "@src/types/user/state.types";
import type { LastFMSunBurstDrawerInterface } from "@src/web/reports/lastfm/generics/types/components/drawer/sunburst.types";
import type { LastFMAggregateReportResponseInterface } from "@src/web/reports/lastfm/generics/types/state/aggregate.report.types";
import type { PlayCountByArtistReportInterface } from "@src/web/reports/lastfm/playcount.artists/types/state/aggregate.report.types";

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
  let mockUserProperties: LastFMUserStateBase;
  let mockReport: MockReportClass;

  beforeEach(
    () => (mockUserProperties = JSON.parse(JSON.stringify(MockStage2Report)))
  );

  const arrange = () => {
    mockReport = new MockReportClass();
    render(
      <ConcreteErrorBase
        router={mockRouterHook}
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
