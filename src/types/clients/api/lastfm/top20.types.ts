import type LastFMBaseClient from "@src/clients/api/lastfm/lastfm.api.client.base.class";
import type { EventCreatorType } from "@src/types/analytics.types";
import type { userDispatchType } from "@src/types/user/context.types";

export type Top20ReportConstructor = new (
  dispatch: userDispatchType,
  eventCreator: EventCreatorType
) => LastFMBaseClient<unknown>;
