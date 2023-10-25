import type { HttpApiClientResponse } from "@src/contracts/api/types/clients/http.client.types";
import type { EventCreatorType } from "@src/web/analytics/collection/events/types/event.types";
import type { IntegrationRequestType } from "@src/web/analytics/collection/types/analytics.types";
import type { reportDispatchType } from "@src/web/reports/generics/types/state/providers/report.context.types";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

export interface GenericApiClientInterface {
  getRoute: () => string;
}

export type GenericApiClientHandlerProps<
  ResponseType,
  ParamsType extends Record<string, string | ReportStateInterface>,
> = {
  dispatcher: reportDispatchType;
  eventDispatcher: EventCreatorType;
  params: ParamsType;
  response: HttpApiClientResponse<ResponseType>;
  typeName: IntegrationRequestType;
};

export type GenericApiClientHandlerType<
  ResponseType,
  ParamsType extends Record<string, string | ReportStateInterface>,
> = (
  props: GenericApiClientHandlerProps<ResponseType, ParamsType>
) => HttpApiClientResponse<ResponseType>;
