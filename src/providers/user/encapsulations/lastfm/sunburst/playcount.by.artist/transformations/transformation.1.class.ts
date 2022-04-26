import TransformationBase from "./playcount.by.artist.sunburst.transformation.base.class";
import type { LastFMTopArtistsReportResponseInterface } from "../../../../../../../types/clients/api/reports/lastfm.client.types";

class InitialTransformation extends TransformationBase<LastFMTopArtistsReportResponseInterface> {
  transform() {
    this.state.userProperties.data.integration = "LASTFM";
    this.state.getReport().status = {
      complete: false,
      steps_total: 2,
      steps_complete: 0,
      operation: this.state.getNextStep(this.params),
    };
  }
}

export default InitialTransformation;
