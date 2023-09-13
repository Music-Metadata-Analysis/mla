import FlipCardAbstractBaseQuery from "../../flip.card.query.base.class";
import { createSimpleComponent } from "@fixtures/react/simple";
import routes from "@src/config/routes";
import LastFMReportFlipCardTopAlbumsStateEncapsulation from "@src/web/reports/lastfm/top20.albums/state/encapsulations/lastfm.report.encapsulation.top.albums.flipcard.class";
import type { LastFMTopAlbumsReportResponseInterface } from "@src/web/api/lastfm/types/lastfm.api.response.types";

export const mockImageUrl = "http://someurl";

export const mockGetReportArtWork = jest.fn(
  (index: number, size: string) => `${mockImageUrl}/${index}/${size}`
);

export class MockReportStateEncapsulation extends LastFMReportFlipCardTopAlbumsStateEncapsulation {
  getArtwork = jest.fn((index: number, size: string) =>
    mockGetReportArtWork(index, size)
  );
}

export const MockDrawerComponent = createSimpleComponent("DrawerComponent");

export class MockQueryClass extends FlipCardAbstractBaseQuery<
  MockReportStateEncapsulation,
  LastFMTopAlbumsReportResponseInterface["albums"]
> {
  analyticsReportType = "TOP20 ALBUMS" as const;
  drawerArtWorkAltTextTranslationKey = "top20Albums.drawer.artWorkAltText";
  drawerComponent = MockDrawerComponent;
  encapsulationClass = MockReportStateEncapsulation;
  hookMethod = "top20albums" as const;
  retryRoute = routes.search.lastfm.top20albums;
  translationKey = "top20Albums" as const;

  getNumberOfImageLoads = (
    reportProperties: MockReportStateEncapsulation["reportProperties"]
  ) => {
    return this.getReportData(reportProperties).length * 2;
  };

  getReportData(
    reportProperties: MockReportStateEncapsulation["reportProperties"]
  ) {
    return reportProperties.data.report.albums;
  }
}
