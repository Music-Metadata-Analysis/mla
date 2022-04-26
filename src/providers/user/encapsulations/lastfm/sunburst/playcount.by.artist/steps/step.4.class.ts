import StepBase from "./playcount.by.artist.sunburst.step.base.class";
import apiRoutes from "../../../../../../../config/apiRoutes";

class NextIsTrackDetails extends StepBase {
  getStep() {
    for (const artist of this.state.getReport().content) {
      for (const album of artist.albums) {
        for (const track of album.tracks) {
          if (track.playcount === null)
            return {
              type: "Track Details" as const,
              resource: track.name,
              url: apiRoutes.v2.data.artists.tracksGet,
              params: {
                album: album.name,
                artist: artist.name,
                track: track.name,
                userName: this.params.userName,
              },
            };
        }
      }
    }
    return null;
  }
}

export default NextIsTrackDetails;
