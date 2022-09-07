import type SunburstDataPointClient from "../../../../clients/api/lastfm/data/sunburst/datapoints/sunburst.datapoint.client.base.class";
import type LastFMSunburstDataClient from "../../../../clients/api/lastfm/data/sunburst/sunburst.client.base.class";
import type SunBurstNodeEncapsulation from "../../../../components/reports/lastfm/common/sunburst.report/encapsulations/sunburst.node.encapsulation.base";
import type UserSunBurstReportBaseState from "../../../../providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";
import type { EventCreatorType } from "../../../analytics.types";
import type { SunBurstData } from "../../../reports/sunburst.types";
import type { userDispatchType } from "../../../user/context.types";
import type { LastFMUserStateBase } from "../../../user/state.types";

export interface StepInterface {
  getStep(): void;
}

export interface TransformationInterface {
  transform(): void;
}

export type SunBurstAggregateReportContent = {
  [key in SunBurstData["entity"]]: unknown[];
} & { playcount: number; name: string };

export interface SunBurstDrawerNodeComponentProps {
  node: SunBurstNodeEncapsulation;
  index: number;
  selectChildNode: (node: SunBurstNodeEncapsulation) => void;
}

export type SunBurstDataPointClientConstructor<EncapsulationType> = {
  new (
    dispatch: userDispatchType,
    event: EventCreatorType,
    encapsulatedState: UserSunBurstReportBaseState<EncapsulationType>
  ): SunburstDataPointClient<EncapsulationType, unknown>;
};

export type SunBurstReportConstructor<AggregateReportType> = new (
  dispatch: userDispatchType,
  eventCreator: EventCreatorType,
  encapsulatedState: UserSunBurstReportBaseState<AggregateReportType>
) => LastFMSunburstDataClient<AggregateReportType>;

export type SunBurstEncapsulationConstructor<AggregateReportType> = new (
  state: LastFMUserStateBase
) => UserSunBurstReportBaseState<AggregateReportType>;