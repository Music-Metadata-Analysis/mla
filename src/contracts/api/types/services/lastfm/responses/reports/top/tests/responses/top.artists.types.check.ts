import { response } from "@src/contracts/api/services/lastfm/fixtures/responses/user.get.top.artists";
import type { LastFMUserArtistInterface } from "../../top.artists.types";

export const checkType: LastFMUserArtistInterface = response.topartists;
