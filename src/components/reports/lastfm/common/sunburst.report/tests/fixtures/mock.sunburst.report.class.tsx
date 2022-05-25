import routes from "../../../../../../../config/routes";
import PlayCountByArtistState from "../../../../../../../providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/user.state.playcount.by.artist.sunburst.report.class";
import MockSunBurstNodeEncapsulation from "../../encapsulations/tests/fixtures/mock.sunburst.node.encapsulation.class";
import SunBurstBaseReport from "../../sunburst.report.base.class";
import type { LastFMReportClassInterface } from "../../../../../../../types/clients/api/lastfm/data.report.types";
import type { PlayCountByArtistReportInterface } from "../../../../../../../types/clients/api/lastfm/response.types";
import type { AggregateBaseReportResponseInterface } from "../../../../../../../types/integrations/base.types";
import type { LastFMUserStateBase } from "../../../../../../../types/user/state.types";

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
  entityKeys = ["albums" as const, "tracks" as const, "artists" as const];
  topLevelEntity = "artists" as const;
  leafEntity = "tracks" as const;
  valueKey = "playcount";
  getReportData(userProperties: MockUserStateEncapsulation["userProperties"]) {
    return userProperties.data.report
      .playCountByArtist as AggregateBaseReportResponseInterface<
      PlayCountByArtistReportInterface[]
    >;
  }
}
