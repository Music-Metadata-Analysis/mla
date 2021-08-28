import * as status from "../config/status";
import type { StatusMessageType } from "../types/clients/https.types";

export const knownStatuses: { [index: number]: StatusMessageType } = {
  429: status.STATUS_429_MESSAGE,
  404: status.STATUS_404_MESSAGE,
};
