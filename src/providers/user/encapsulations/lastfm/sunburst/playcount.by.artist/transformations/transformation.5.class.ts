import TransformationBase from "./playcount.by.artist.sunburst.transformation.base.class";
import type { LastFMTrackInfoInterface } from "../../../../../../../types/integrations/lastfm/api.types";

class AttachTrackInfo extends TransformationBase<LastFMTrackInfoInterface> {
  transform() {
    const trackInfo = {
      name: this.response.name as string,
      playcount: parseInt(this.response.userplaycount),
    };
    const artistIndex = this.findArtist();
    const albumIndex = this.findAlbum(artistIndex);
    const trackIndex = this.findTrack(artistIndex, albumIndex);
    this.state.getReport().content[artistIndex].albums[albumIndex].tracks[
      trackIndex
    ] = trackInfo;
    const operation = this.state.getNextStep(this.params);
    this.state.getReport().status = {
      complete: operation ? false : true,
      steps_total: this.state.getReportStatus().steps_total,
      steps_complete: (this.state.getReportStatus().steps_complete += 1),
    };
    if (operation) this.state.getReport().status.operation = operation;
  }
}

export default AttachTrackInfo;
