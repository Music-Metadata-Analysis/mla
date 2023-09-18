import TransformationBase from "./lastfm.report.playcount.by.artist.sunburst.transformation.base.class";
import type { LastFMTopArtistsReportResponseInterface } from "@src/web/api/lastfm/types/lastfm.api.response.types";

class AttachUserArtists extends TransformationBase<LastFMTopArtistsReportResponseInterface> {
  transform() {
    const userArtists =
      this.response.artists?.map((artist) => ({
        name: artist.name as string,
        playcount: artist.playcount ? parseInt(artist.playcount as string) : 0,
        albums: [],
        fetched: false,
      })) || [];
    this.state.getReport().content = userArtists;
    this.state.getDispatchState().image = this.response.image;
    this.state.getDispatchState().playcount = this.response.playcount;
    if (this.response.playcount === 0) {
      this.userWithoutListens();
    } else {
      this.userWithListens(userArtists.length);
    }
  }

  private userWithoutListens() {
    this.state.getReport().status = {
      complete: true,
      steps_total: this.state.getReportStatus().steps_total + 1,
      steps_complete: this.state.getReportStatus().steps_complete + 1,
    };
  }

  private userWithListens(artistCount: number) {
    this.state.getReport().status = {
      complete: false,
      steps_total: this.state.getReportStatus().steps_total + artistCount + 1,
      steps_complete: this.state.getReportStatus().steps_complete + 1,
      operation: this.state.getNextStep(this.params),
    };
  }
}

export default AttachUserArtists;
