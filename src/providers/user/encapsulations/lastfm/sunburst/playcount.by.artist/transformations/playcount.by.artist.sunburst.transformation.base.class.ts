import type PlayCountByArtistState from "../user.state.playcount.by.artist.sunburst.report.class";
import type { LastFMReportClientParamsInterface } from "@src/web/api/lastfm/types/report.client.types";
import type { TransformationInterface } from "@src/web/reports/generics/types/state/aggregate.report.types";

abstract class PlayCountByArtistTransformationBase<ResponseType>
  implements TransformationInterface
{
  state: PlayCountByArtistState;
  response: ResponseType;
  params: LastFMReportClientParamsInterface;

  constructor(
    state: PlayCountByArtistState,
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

export default PlayCountByArtistTransformationBase;
