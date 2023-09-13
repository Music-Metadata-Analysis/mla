import SunBurstBaseQuery from "../../sunburst.query.base.class";
import { createSimpleComponent } from "@fixtures/react/simple";
import routes from "@src/config/routes";
import MockSunBurstNodeAbstractBase from "@src/web/reports/lastfm/generics/components/report.component/sunburst/encapsulations/tests/implementations/concrete.sunburst.node.encapsulation.class";
import LastFMReportPlayCountByArtistStateEncapsulation from "@src/web/reports/lastfm/generics/state/encapsulations/tests/implementations/concrete.lastfm.report.encapsulation.sunburst.class";
import type { LastFMAggregateReportResponseInterface } from "@src/web/reports/lastfm/generics/types/state/lastfm.aggregate.report.types";
import type { PlayCountByArtistReportInterface } from "@src/web/reports/lastfm/playcount.by.artist/types/state/aggregate.report.types";

export const mockImageUrl = "http://someurl";

export const mockGetReportArtWork = jest.fn(
  (index: number, size: string) => `${mockImageUrl}/${index}/${size}`
);

export class MockReportStateEncapsulation extends LastFMReportPlayCountByArtistStateEncapsulation {}

export const MockDrawerComponent = createSimpleComponent("DrawerComponent");

export class MockQueryClass extends SunBurstBaseQuery<MockReportStateEncapsulation> {
  retryRoute = routes.search.lastfm.top20albums;
  drawerComponent = MockDrawerComponent;
  encapsulationClass = MockReportStateEncapsulation;
  nodeEncapsulationClass = MockSunBurstNodeAbstractBase;
  translationKey = "playCountByArtist" as const;
  analyticsReportType = "PLAYCOUNT BY ARTIST" as const;
  drawerArtWorkAltText = "top20Albums.drawer.artWorkAltText";
  hookMethod = "playCountByArtist" as const;
  entityKeys = ["artists" as const, "albums" as const, "tracks" as const];
  valueKey = "playcount";
  getReportData(
    reportProperties: MockReportStateEncapsulation["reportProperties"]
  ) {
    return reportProperties.data.report
      .playCountByArtist as LastFMAggregateReportResponseInterface<
      PlayCountByArtistReportInterface[]
    >;
  }
}
