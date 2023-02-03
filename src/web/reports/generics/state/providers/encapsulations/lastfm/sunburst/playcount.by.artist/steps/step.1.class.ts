import StepBase from "./playcount.by.artist.sunburst.step.base.class";
import apiRoutes from "@src/config/apiRoutes";

class NextIsUserProfile extends StepBase {
  getStep() {
    if (this.state.getReport().content.length === 0) {
      return {
        type: "User Profile" as const,
        resource: this.params.userName,
        url: apiRoutes.v2.reports.lastfm.top20artists,
        params: {
          userName: this.params.userName,
        },
      };
    }
    return null;
  }
}

export default NextIsUserProfile;
