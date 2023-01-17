import { response } from "@src/contracts/api/fixtures/services/lastfm/responses/artist.get.topalbums";
import type { LastFMArtistTopAlbumsInterface } from "../artist.topalbums.types";

export const checkType: LastFMArtistTopAlbumsInterface = response.topalbums;
