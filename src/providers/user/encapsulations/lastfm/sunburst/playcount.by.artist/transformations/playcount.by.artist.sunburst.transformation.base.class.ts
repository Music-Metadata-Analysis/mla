import type { LastFMClientParamsInterface } from "../../../../../../../types/clients/api/lastfm/request.types";
import type { TransformationInterface } from "../../../../../../../types/clients/api/lastfm/sunburst.types";
import type UserPlaycountByArtistState from "../user.state.playcount.by.artist.sunburst.report.class";
abstract class PlayCountByArtistTransformationBase<ResponseType>
  implements TransformationInterface
{
  state: UserPlaycountByArtistState;
  response: ResponseType;
  params: LastFMClientParamsInterface;

  constructor(
    state: UserPlaycountByArtistState,
    params: LastFMClientParamsInterface,
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
