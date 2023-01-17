import { response } from "@src/contracts/api/fixtures/services/lastfm/responses/track.get.info";
import type { LastFMTrackInfoInterface } from "../track.info.types";

export const checkType: LastFMTrackInfoInterface = response.track;
