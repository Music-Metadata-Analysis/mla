import TransformationBase from "./playcount.by.artist.sunburst.transformation.base.class";
import type { LastFMTrackInfoInterface } from "@src/web/api/lastfm/types/response.types";

class RemoveEntity extends TransformationBase<LastFMTrackInfoInterface> {
  transform() {
    if (this.params.track) return this.removeTrack();
    if (this.params.album) return this.removeAlbum();
    if (this.params.artist) return this.removeArtist();
  }

  private removeTrack() {
    const artistIndex = this.findArtist();
    const albumIndex = this.findAlbum(artistIndex);
    const trackIndex = this.findTrack(artistIndex, albumIndex);
    this.state
      .getReport()
      .content[artistIndex].albums[albumIndex].tracks.splice(trackIndex, 1);
    this.getNextStep();
  }

  private removeAlbum() {
    const artistIndex = this.findArtist();
    const albumIndex = this.findAlbum(artistIndex);
    this.state.getReport().content[artistIndex].albums.splice(albumIndex, 1);
    this.getNextStep();
  }

  private removeArtist() {
    const artistIndex = this.findArtist();
    this.state.getReport().content.splice(artistIndex, 1);
    this.getNextStep();
  }

  private getNextStep() {
    const operation = this.state.getNextStep(this.params);
    this.state.getReport().status = {
      complete: operation === undefined,
      steps_total: this.state.getReportStatus().steps_total - 1,
      steps_complete: this.state.getReportStatus().steps_complete,
    };
    this.state.getReportStatus().operation = operation;
  }
}

export default RemoveEntity;
