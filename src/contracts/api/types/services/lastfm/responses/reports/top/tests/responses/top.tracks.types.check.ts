import { response } from "@src/contracts/api/services/lastfm/fixtures/responses/user.get.top.tracks";
import type { LastFMUserTrackInterface } from "../../top.tracks.types";

export const checkType: LastFMUserTrackInterface = response.toptracks;
