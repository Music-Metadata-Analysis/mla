import AbstractReportClass from "../../report.base.class";
import { createSimpleComponent } from "@fixtures/react/simple";
import routes from "@src/config/routes";
import UserState from "@src/providers/user/encapsulations/lastfm/user.state.base.class";
import type { LastFMReportInterface } from "@src/types/clients/api/lastfm/data.report.types";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";
import type { LastFMUserStateBase } from "@src/types/user/state.types";

export class MockUserStateEncapsulation extends UserState {
  t?: tFunctionType;
  constructor(userProperties: UserState["userProperties"], t?: tFunctionType) {
    super(userProperties);
    this.t = t;
  }
}

export const MockDrawerComponent = createSimpleComponent("DrawerComponent");

export class MockBaseReportClass
  extends AbstractReportClass<
    UserState,
    UserState["userProperties"],
    Record<string, never>
  >
  implements
    LastFMReportInterface<
      UserState,
      UserState["userProperties"],
      Record<string, never>
    >
{
  analyticsReportType = "TOP20 ALBUMS" as const;

  drawerArtWorkAltTextTranslationKey = "top20Albums.drawer.artWorkAltText";
  drawerComponent = MockDrawerComponent;
  encapsulationClass = MockUserStateEncapsulation;
  hookMethod = "top20albums" as const;
  retryRoute = routes.search.lastfm.top20albums;
  translationKey = "top20Albums" as const;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryUserHasNoData(userProperties: LastFMUserStateBase): boolean {
    throw new Error("Method not implemented.");
  }

  getReportData(userProperties: MockUserStateEncapsulation["userProperties"]) {
    return userProperties;
  }
}
