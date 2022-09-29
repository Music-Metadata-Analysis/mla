import FlipCardBaseReport from "../../flip.card.report.base.class";
import { createSimpleComponent } from "@fixtures/react/simple";
import routes from "@src/config/routes";
import UserAlbumState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.album.flipcard.report.class";

export const mockImageUrl = "http://someurl";

export const mockGetReportArtWork = jest.fn(
  (index: number, size: string) => `${mockImageUrl}/${index}/${size}`
);

export class MockUserStateEncapsulation extends UserAlbumState {
  getArtwork = jest.fn((index: number, size: string) =>
    mockGetReportArtWork(index, size)
  );
}

export const MockDrawerComponent = createSimpleComponent("DrawerComponent");

export class MockReportClass extends FlipCardBaseReport<MockUserStateEncapsulation> {
  retryRoute = routes.search.lastfm.top20albums;
  drawerComponent = MockDrawerComponent;
  translationKey = "top20Albums" as const;
  analyticsReportType = "TOP20 ALBUMS" as const;
  encapsulationClass = MockUserStateEncapsulation;
  drawerArtWorkAltText = "top20Albums.drawer.artWorkAltText";
  hookMethod = "top20albums" as const;

  getNumberOfImageLoads = (
    userProperties: MockUserStateEncapsulation["userProperties"]
  ) => {
    return this.getReportData(userProperties).length * 2;
  };

  getReportData(userProperties: MockUserStateEncapsulation["userProperties"]) {
    return userProperties.data.report.albums;
  }
}
