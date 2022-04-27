import StepBase from "./playcount.by.artist.sunburst.step.base.class";
import apiRoutes from "../../../../../../../config/apiRoutes";

class NextIsAlbumDetails extends StepBase {
  getStep() {
    for (const artist of this.state.getReport().content) {
      for (const album of artist.albums) {
        if (album.playcount === null)
          return {
            type: "Album Details" as const,
            resource: album.name,
            url: this.attachParamsToUrl(apiRoutes.v2.data.artists.albumsGet, {
              album: album.name,
              artist: artist.name,
              userName: this.params.userName,
            }),
          };
      }
    }
    return null;
  }
}

export default NextIsAlbumDetails;
