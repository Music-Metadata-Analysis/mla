import { response } from "@src/contracts/api/services/lastfm/fixtures/responses/user.get.top.albums";
import type { LastFMUserAlbumInterface } from "../../top.albums.types";

export const checkType: LastFMUserAlbumInterface = response.topalbums;
