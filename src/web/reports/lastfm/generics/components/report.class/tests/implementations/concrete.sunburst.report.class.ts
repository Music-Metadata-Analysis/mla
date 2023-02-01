import SunBurstBaseReport from "../../sunburst.report.base.class";
import { createSimpleComponent } from "@fixtures/react/simple";
import routes from "@src/config/routes";
import PlayCountByArtistState from "@src/providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/user.state.playcount.by.artist.sunburst.report.class";
import MockSunBurstNodeAbstractBase from "@src/web/reports/lastfm/generics/components/report.component/sunburst/encapsulations/tests/implementations/concrete.sunburst.node.encapsulation.class";
import type { LastFMAggregateReportResponseInterface } from "@src/web/reports/lastfm/generics/types/state/aggregate.report.types";
import type { PlayCountByArtistReportInterface } from "@src/web/reports/lastfm/playcount.artists/types/state/aggregate.report.types";

export const mockImageUrl = "http://someurl";

export const mockGetReportArtWork = jest.fn(
  (index: number, size: string) => `${mockImageUrl}/${index}/${size}`
);

export class MockUserStateEncapsulation extends PlayCountByArtistState {}

export const MockDrawerComponent = createSimpleComponent("DrawerComponent");

export class MockReportClass extends SunBurstBaseReport<MockUserStateEncapsulation> {
  retryRoute = routes.search.lastfm.top20albums;
  drawerComponent = MockDrawerComponent;
  encapsulationClass = MockUserStateEncapsulation;
  nodeEncapsulationClass = MockSunBurstNodeAbstractBase;
  translationKey = "playCountByArtist" as const;
  analyticsReportType = "PLAYCOUNT BY ARTIST" as const;
  drawerArtWorkAltText = "top20Albums.drawer.artWorkAltText";
  hookMethod = "playCountByArtist" as const;
  entityKeys = ["artists" as const, "albums" as const, "tracks" as const];
  valueKey = "playcount";
  getReportData(userProperties: MockUserStateEncapsulation["userProperties"]) {
    return userProperties.data.report
      .playCountByArtist as LastFMAggregateReportResponseInterface<
      PlayCountByArtistReportInterface[]
    >;
  }
}
