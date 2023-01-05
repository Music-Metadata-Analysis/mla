import TransformationBase from "./playcount.by.artist.sunburst.transformation.base.class";
import type { LastFMArtistTopAlbumsInterface } from "@src/types/clients/api/lastfm/response.types";

class AttachArtistAlbums extends TransformationBase<
  LastFMArtistTopAlbumsInterface[]
> {
  transform() {
    const artistAlbums = this.response.map((album) => ({
      name: album.name as string,
      playcount: null,
      tracks: [],
      fetched: false,
    }));
    const artistIndex = this.findArtist();
    this.state.getReport().content[artistIndex].albums = artistAlbums;
    this.state.getReport().content[artistIndex].fetched = true;
    this.state.getReport().status = {
      complete: false,
      steps_total:
        this.state.getReportStatus().steps_total + artistAlbums.length,
      steps_complete: this.state.getReportStatus().steps_complete + 1,
      operation: this.state.getNextStep(this.params),
    };
  }
}

export default AttachArtistAlbums;
