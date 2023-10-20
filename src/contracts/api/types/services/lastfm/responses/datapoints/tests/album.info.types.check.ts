import { response } from "@src/contracts/api/services/lastfm/fixtures/responses/album.get.info";
import type { LastFMAlbumInfoInterface } from "../album.info.types";

export const checkType: LastFMAlbumInfoInterface = response.album;
