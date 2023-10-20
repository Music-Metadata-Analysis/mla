import type LastFMReportPlayCountByArtistStateEncapsulation from "../lastfm.report.encapsulation.playcount.by.artist.class";
import type { LastFMReportClientParamsInterface } from "@src/contracts/api/types/clients/lastfm.client.types";
import type { TransformationInterface } from "@src/web/reports/generics/types/state/encapsulations/aggregate.report.encapsulation.types";

abstract class LastFMPlayCountByArtistStateTransformationBase<ResponseType>
  implements TransformationInterface
{
  state: LastFMReportPlayCountByArtistStateEncapsulation;
  response: ResponseType;
  params: LastFMReportClientParamsInterface;

  constructor(
    state: LastFMReportPlayCountByArtistStateEncapsulation,
    params: LastFMReportClientParamsInterface,
    response: unknown
  ) {
    this.state = state;
    this.response = response as ResponseType;
    this.params = params;
  }
  abstract transform(): void;

  findAlbum(artistIndex: number) {
    return this.state
      .getReport()
      .content[artistIndex].albums.findIndex(
        (album) => album.name === this.params.album
      );
  }

  findArtist() {
    return this.state
      .getReport()
      .content.findIndex((artist) => artist.name === this.params.artist);
  }

  findTrack(artistIndex: number, albumIndex: number) {
    return this.state
      .getReport()
      .content[artistIndex].albums[albumIndex].tracks.findIndex(
        (track) => track.name === this.params.track
      );
  }
}

export default LastFMPlayCountByArtistStateTransformationBase;
