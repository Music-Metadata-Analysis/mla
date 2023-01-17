import { response } from "@src/contracts/api/fixtures/services/lastfm/responses/album.get.info";
import type { LastFMAlbumInfoInterface } from "../album.info.types";

export const checkType: LastFMAlbumInfoInterface = response.album;
