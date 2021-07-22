import type {
  LastFMAlbumDataInterface,
  LastFMImageDataInterface,
} from "../../../integrations/lastfm/api.types";
import type { TopAlbumsReportResponseInterface } from "../../../proxy.types";
import type { Modify } from "../../../util.types";

export interface LastFMTopAlbumsReportInterface {
  retrieveAlbumReport: (userName: string) => void;
}

export type LastFMTopAlbumsReportResponseInterface = Modify<
  TopAlbumsReportResponseInterface,
  {
    albums: LastFMAlbumDataInterface[];
    image: LastFMImageDataInterface[];
  }
>;
