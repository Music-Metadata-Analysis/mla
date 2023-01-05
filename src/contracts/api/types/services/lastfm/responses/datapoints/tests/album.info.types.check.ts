import { response } from "./fixtures/album.get.info";
import type { LastFMAlbumInfoInterface } from "../album.info.types";

export const checkType: LastFMAlbumInfoInterface = response.album;
