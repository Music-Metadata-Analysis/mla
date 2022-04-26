import TransformationBase from "./playcount.by.artist.sunburst.transformation.base.class";
import type { LastFMTopArtistsReportResponseInterface } from "../../../../../../../types/clients/api/reports/lastfm.client.types";

class AttachUserArtists extends TransformationBase<LastFMTopArtistsReportResponseInterface> {
  transform() {
    const userArtists = this.response.artists?.map((artist) => ({
      name: artist.name as string,
      playcount: parseInt(artist.playcount as string),
      albums: [],
    }));
    this.state.getReport().content = userArtists;
    this.state.userProperties.data.integration = "LASTFM";
    this.state.getDispatchState().image = this.response.image;
    this.state.getDispatchState().image = this.response.image;
    this.state.getDispatchState().playcount = this.response.playcount;
    this.state.getReport().status = {
      complete: false,
      steps_total: 2 + userArtists.length,
      steps_complete: 1,
      operation: this.state.getNextStep(this.params),
    };
  }
}

export default AttachUserArtists;
