import { response } from "@src/contracts/api/fixtures/services/lastfm/responses/user.get.top.albums";
import type { LastFMUserAlbumInterface } from "../../top.albums.types";

export const checkType: LastFMUserAlbumInterface = response.topalbums;
