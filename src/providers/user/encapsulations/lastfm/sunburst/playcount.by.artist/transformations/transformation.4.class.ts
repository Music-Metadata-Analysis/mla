import TransformationBase from "./playcount.by.artist.sunburst.transformation.base.class";
import type { LastFMAlbumInfoInterface } from "@src/web/api/lastfm/types/lastfm/response.types";

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
}

export default AttachAlbumInfo;
