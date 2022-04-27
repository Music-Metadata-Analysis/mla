import TransformationBase from "./playcount.by.artist.sunburst.transformation.base.class";
import type { LastFMAlbumInfoInterface } from "../../../../../../../types/integrations/lastfm/api.types";

class AttachAlbumInfo extends TransformationBase<LastFMAlbumInfoInterface> {
  transform() {
    const albumTracks = this.response.tracks.track.map((track) => ({
      name: track.name as string,
      playcount: null,
    }));
    const albumInfo = {
      name: this.response.name as string,
      playcount: this.response.userplaycount,
      tracks: albumTracks,
    };
    const artistIndex = this.findArtist();
    const albumIndex = this.findAlbum(artistIndex);
    this.state.getReport().content[artistIndex].albums[albumIndex] = albumInfo;
    this.state.getReport().status = {
      complete: false,
      steps_total:
        this.state.getReportStatus().steps_total + albumInfo.tracks.length,
      steps_complete: (this.state.getReportStatus().steps_complete += 1),
      operation: this.state.getNextStep(this.params),
    };
  }
}

export default AttachAlbumInfo;
