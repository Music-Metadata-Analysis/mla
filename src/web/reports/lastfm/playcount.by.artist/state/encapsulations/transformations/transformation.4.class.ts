import TransformationBase from "./lastfm.report.playcount.by.artist.sunburst.transformation.base.class";
import type {
  PlayCountByArtistReportInterface,
  PlayCountByArtistReportInterface_Album,
} from "@src/contracts/api/types/services/lastfm/aggregates/lastfm.playcount.by.artist.report.types";
import type { LastFMAlbumInfoInterface } from "@src/contracts/api/types/services/lastfm/responses/datapoints/album.info.types";

class AttachAlbumInfo extends TransformationBase<LastFMAlbumInfoInterface> {
  transform() {
    if (!this.response.tracks) this.response.tracks = { track: [] };
    if (!Array.isArray(this.response.tracks.track))
      this.response.tracks.track = [this.response.tracks.track];
    const albumTracks = this.response.tracks.track.map((track) => ({
      name: track.name as string,
      rank: track["@attr"].rank as number,
      fetched: true,
    }));
    const albumInfo = {
      name: this.response.name as string,
      playcount: this.response.userplaycount ? this.response.userplaycount : 0,
      tracks: albumTracks,
      fetched: true,
    };
    const artistIndex = this.findArtist();
    const albumIndex = this.findAlbum(artistIndex);
    this.state.getReport().content[artistIndex].albums[albumIndex] = albumInfo;

    const identifiedPlaycount = this.countIdentifiedArtistPlays(
      this.state.getReport().content[artistIndex]
    );
    if (
      identifiedPlaycount >=
      Number(this.state.getReport().content[artistIndex].playcount)
    ) {
      this.skipFetchingAlbums(
        this.state.getReport().content[artistIndex].albums
      );
    }

    const operation = this.state.getNextStep(this.params);
    this.state.getReport().status = {
      complete: operation === undefined,
      steps_total: this.state.getReportStatus().steps_total,
      steps_complete: this.state.getReportStatus().steps_complete + 1,
    };

    if (operation) {
      this.state.getReport().status.operation = operation;
    } else {
      this.state.getReport().created = new Date().toISOString();
    }
  }

  private countIdentifiedArtistPlays(
    artist: PlayCountByArtistReportInterface
  ): number {
    let count = 0;
    for (const album of artist.albums) {
      if (album.playcount) count += album.playcount;
    }
    return count;
  }

  private skipFetchingAlbums(albums: PlayCountByArtistReportInterface_Album[]) {
    albums.forEach((album) => {
      if (!album.fetched) {
        this.state.getReport().status.steps_complete += 1;
        album.fetched = true;
        album.playcount = 0;
      }
    });
  }
}

export default AttachAlbumInfo;
