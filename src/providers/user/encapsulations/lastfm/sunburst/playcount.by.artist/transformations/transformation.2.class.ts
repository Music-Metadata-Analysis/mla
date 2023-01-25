import TransformationBase from "./playcount.by.artist.sunburst.transformation.base.class";
import type { LastFMTopArtistsReportResponseInterface } from "@src/web/api/lastfm/types/lastfm/response.types";

class AttachUserArtists extends TransformationBase<LastFMTopArtistsReportResponseInterface> {
  userWithoutListens() {
    this.state.getReport().status = {
      complete: true,
      steps_total: this.state.getReportStatus().steps_total + 1,
      steps_complete: this.state.getReportStatus().steps_complete + 1,
    };
  }

  userWithListens(artistCount: number) {
    this.state.getReport().status = {
      complete: false,
      steps_total: this.state.getReportStatus().steps_total + artistCount + 1,
      steps_complete: this.state.getReportStatus().steps_complete + 1,
      operation: this.state.getNextStep(this.params),
    };
  }

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
}

export default AttachUserArtists;
