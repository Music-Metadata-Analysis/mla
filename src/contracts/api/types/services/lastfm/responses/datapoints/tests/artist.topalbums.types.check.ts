import { response } from "@src/contracts/api/services/lastfm/fixtures/responses/artist.get.topalbums";
import type { LastFMArtistTopAlbumsInterface } from "../artist.topalbums.types";

export const checkType: LastFMArtistTopAlbumsInterface = response.topalbums;
