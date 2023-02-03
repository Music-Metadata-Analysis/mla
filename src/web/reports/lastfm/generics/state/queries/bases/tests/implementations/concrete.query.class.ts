import AbstractReportClass from "../../query.base.class";
import { createSimpleComponent } from "@fixtures/react/simple";
import routes from "@src/config/routes";
import UserState from "@src/web/reports/generics/state/providers/encapsulations/lastfm/user.state.base.class";
import type { LastFMUserStateBase } from "@src/types/user/state.types";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";
import type { LastFMReportStateQueryInterface } from "@src/web/reports/lastfm/generics/types/state/queries/base.types";

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
    LastFMReportStateQueryInterface<
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
