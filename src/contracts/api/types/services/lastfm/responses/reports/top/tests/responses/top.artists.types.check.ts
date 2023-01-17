import { response } from "@src/contracts/api/fixtures/services/lastfm/responses/user.get.top.artists";
import type { LastFMUserArtistInterface } from "../../top.artists.types";

export const checkType: LastFMUserArtistInterface = response.topartists;
