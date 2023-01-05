import { response } from "./fixtures/artist.get.topalbums";
import type { LastFMArtistTopAlbumsInterface } from "../artist.topalbums.types";

export const checkType: LastFMArtistTopAlbumsInterface = response.topalbums;
