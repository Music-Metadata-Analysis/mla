import StepBase from "./playcount.by.artist.sunburst.step.base.class";
import apiRoutes from "@src/config/apiRoutes";

class NextIsAlbumDetails extends StepBase {
  getStep() {
    for (const artist of this.state.getReport().content) {
      for (const album of artist.albums) {
        if (!album.fetched) {
          return {
            type: "Album Details" as const,
            resource: album.name,
            url: apiRoutes.v2.data.artists.albumsGet,
            params: {
              album: album.name,
              artist: artist.name,
              userName: this.params.userName,
            },
          };
        }
      }
    }
    return null;
  }
}

export default NextIsAlbumDetails;
