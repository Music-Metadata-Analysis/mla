import { response } from "@src/contracts/api/services/lastfm/fixtures/responses/track.get.info";
import type { LastFMTrackInfoInterface } from "../track.info.types";

export const checkType: LastFMTrackInfoInterface = response.track;
