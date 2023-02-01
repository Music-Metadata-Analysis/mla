import type UserSunBurstReportBaseState from "@src/providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";
import type { userDispatchType } from "@src/types/user/context.types";
import type { EventCreatorType } from "@src/web/analytics/collection/events/types/event.types";
import type SunburstDataPointClient from "@src/web/api/lastfm/data/sunburst/datapoints/sunburst.datapoint.client.base.class";

export type SunBurstDataPointClientConstructor<EncapsulationType> = {
  new (
    dispatch: userDispatchType,
    event: EventCreatorType,
    encapsulatedState: UserSunBurstReportBaseState<EncapsulationType>
  ): SunburstDataPointClient<EncapsulationType, unknown>;
};
