import type {
  LastFMAlbumDataInterface,
  LastFMImageDataInterface,
} from "../../../integrations/lastfm/api.types";
import type { TopAlbumsReportResponseInterface } from "../../../proxy.types";

export interface LastFMTopAlbumsReportInterface {
  retrieveAlbumReport: (userName: string) => void;
}

export interface LastFMTopAlbumsReportResponseInterface
  extends TopAlbumsReportResponseInterface {
  albums: LastFMAlbumDataInterface[];
  image: LastFMImageDataInterface[];
}
