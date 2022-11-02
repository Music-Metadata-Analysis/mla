import { render, screen } from "@testing-library/react";
import ErrorConditionBase from "../error.condition.base.class.component";
import { MockReportClass } from "@src/components/reports/lastfm/common/report.class/tests/implementations/concrete.sunburst.report.class";
import mockRouterHook from "@src/hooks/__mocks__/router.mock";
import MockStage2Report from "@src/providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/tests/fixtures/user.state.playcount.by.artist.sunburst.stage.2.json";
import type { LastFMSunBurstDrawerInterface } from "@src/types/clients/api/lastfm/drawer.component.types";
import type { PlayCountByArtistReportInterface } from "@src/types/clients/api/lastfm/response.types";
import type { AggregateBaseReportResponseInterface } from "@src/types/integrations/base.types";
import type { LastFMUserStateBase } from "@src/types/user/state.types";

class ConcreteErrorBase extends ErrorConditionBase<
  AggregateBaseReportResponseInterface<PlayCountByArtistReportInterface[]>,
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
