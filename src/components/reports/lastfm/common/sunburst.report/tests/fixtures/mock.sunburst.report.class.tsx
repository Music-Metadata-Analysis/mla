import SunBurstBaseReport from "../../sunburst.report.base.class";
import MockSunBurstNodeEncapsulation from "@src/components/reports/lastfm/common/sunburst.report/encapsulations/tests/fixtures/mock.sunburst.node.encapsulation.class";
import routes from "@src/config/routes";
import PlayCountByArtistState from "@src/providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/user.state.playcount.by.artist.sunburst.report.class";
import type { LastFMReportClassInterface } from "@src/types/clients/api/lastfm/data.report.types";
import type { PlayCountByArtistReportInterface } from "@src/types/clients/api/lastfm/response.types";
import type { AggregateBaseReportResponseInterface } from "@src/types/integrations/base.types";
import type { LastFMUserStateBase } from "@src/types/user/state.types";

export const mockImageUrl = "http://someurl";

export const mockGetReportArtWork = jest.fn(
  (index: number, size: string) => `${mockImageUrl}/${index}/${size}`
);

export class MockUserStateEncapsulation extends PlayCountByArtistState {}

export const MockDrawerComponent = jest.fn(() => (
  <div>MockDrawerComponent</div>
));

export class MockReportClass
  extends SunBurstBaseReport<MockUserStateEncapsulation>
  implements
    LastFMReportClassInterface<
      LastFMUserStateBase,
      AggregateBaseReportResponseInterface<PlayCountByArtistReportInterface[]>
    >
{
  retryRoute = routes.search.lastfm.top20albums;
  drawerComponent = MockDrawerComponent;
  encapsulationClass = MockUserStateEncapsulation;
  nodeEncapsulationClass = MockSunBurstNodeEncapsulation;
  translationKey = "playCountByArtist" as const;
  analyticsReportType = "PLAYCOUNT BY ARTIST" as const;
  drawerArtWorkAltText = "top20Albums.drawer.artWorkAltText";
  hookMethod = "playCountByArtist" as const;
  entityKeys = ["artists" as const, "albums" as const, "tracks" as const];
  valueKey = "playcount";
  getReportData(userProperties: MockUserStateEncapsulation["userProperties"]) {
    return userProperties.data.report
      .playCountByArtist as AggregateBaseReportResponseInterface<
      PlayCountByArtistReportInterface[]
    >;
  }
}
