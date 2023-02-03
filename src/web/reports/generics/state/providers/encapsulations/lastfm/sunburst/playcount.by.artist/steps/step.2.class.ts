import StepBase from "./playcount.by.artist.sunburst.step.base.class";
import apiRoutes from "@src/config/apiRoutes";

class NextIsTopAlbums extends StepBase {
  getStep() {
    for (const artist of this.state.getReport().content) {
      if (!artist.fetched)
        return {
          type: "Top Albums" as const,
          resource: artist.name,
          url: apiRoutes.v2.data.artists.albumsList,
          params: {
            artist: artist.name,
            userName: this.params.userName,
          },
        };
    }
    return null;
  }
}

export default NextIsTopAlbums;
