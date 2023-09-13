import LastFMReportQueryAbstractBaseClass from "../../query.base.class";
import { createSimpleComponent } from "@fixtures/react/simple";
import routes from "@src/config/routes";
import ReportStateEncapsulation from "@src/web/reports/lastfm/generics/state/encapsulations/bases/lastfm.report.encapsulation.base.class";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";
import type { LastFMReportStateBase } from "@src/web/reports/lastfm/generics/types/state/providers/lastfm.report.state.types";
import type { LastFMReportStateQueryInterface } from "@src/web/reports/lastfm/generics/types/state/queries/base.types";

export class MockReportStateEncapsulation extends ReportStateEncapsulation {
  t?: tFunctionType;
  constructor(
    reportProperties: ReportStateEncapsulation["reportProperties"],
    t?: tFunctionType
  ) {
    super(reportProperties);
    this.t = t;
  }
}

export const MockDrawerComponent = createSimpleComponent("DrawerComponent");

export class MockBaseQueryClass
  extends LastFMReportQueryAbstractBaseClass<
    ReportStateEncapsulation,
    ReportStateEncapsulation["reportProperties"],
    Record<string, never>
  >
  implements
    LastFMReportStateQueryInterface<
      ReportStateEncapsulation,
      ReportStateEncapsulation["reportProperties"],
      Record<string, never>
    >
{
  analyticsReportType = "TOP20 ALBUMS" as const;

  drawerArtWorkAltTextTranslationKey = "top20Albums.drawer.artWorkAltText";
  drawerComponent = MockDrawerComponent;
  encapsulationClass = MockReportStateEncapsulation;
  hookMethod = "top20albums" as const;
  retryRoute = routes.search.lastfm.top20albums;
  translationKey = "top20Albums" as const;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryUserHasNoData(reportProperties: LastFMReportStateBase): boolean {
    throw new Error("Method not implemented.");
  }

  getReportData(
    reportProperties: MockReportStateEncapsulation["reportProperties"]
  ) {
    return reportProperties;
  }
}
