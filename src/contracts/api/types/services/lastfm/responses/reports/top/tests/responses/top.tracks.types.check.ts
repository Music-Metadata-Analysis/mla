import { response } from "@src/contracts/api/fixtures/services/lastfm/responses/user.get.top.tracks";
import type { LastFMUserTrackInterface } from "../../top.tracks.types";

export const checkType: LastFMUserTrackInterface = response.toptracks;
