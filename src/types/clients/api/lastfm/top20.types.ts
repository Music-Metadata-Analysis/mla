import type LastFMBaseClient from "../../../../clients/api/lastfm/lastfm.api.client.base.class";
import type { EventCreatorType } from "../../../analytics.types";
import type { userDispatchType } from "../../../user/context.types";

export type Top20ReportConstructor = new (
  dispatch: userDispatchType,
  eventCreator: EventCreatorType
) => LastFMBaseClient<unknown>;
