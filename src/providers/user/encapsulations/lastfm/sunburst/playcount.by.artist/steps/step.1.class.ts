import StepBase from "./playcount.by.artist.sunburst.step.base.class";
import apiRoutes from "../../../../../../../config/apiRoutes";

class NextIsUserProfile extends StepBase {
  getStep() {
    if (this.state.getReport().content.length === 0) {
      return {
        type: "User Profile" as const,
        resource: this.params.userName,
        url: this.attachParamsToUrl(apiRoutes.v2.reports.lastfm.top20artists, {
          userName: this.params.userName,
        }),
      };
    }
    return null;
  }
}

export default NextIsUserProfile;
