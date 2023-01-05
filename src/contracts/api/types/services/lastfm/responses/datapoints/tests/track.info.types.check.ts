import { response } from "./fixtures/track.get.info";
import type { LastFMTrackInfoInterface } from "../track.info.types";

export const checkType: LastFMTrackInfoInterface = response.track;
