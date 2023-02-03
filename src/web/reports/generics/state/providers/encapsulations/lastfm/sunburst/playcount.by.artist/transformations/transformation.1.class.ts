import TransformationBase from "./playcount.by.artist.sunburst.transformation.base.class";

class InitialTransformation extends TransformationBase<[]> {
  transform() {
    this.state.userProperties.data.integration = "LASTFM";
    this.state.getReport().status = {
      complete: false,
      steps_total: this.state.getReportStatus().steps_total + 1,
      steps_complete: this.state.getReportStatus().steps_complete + 1,
      operation: this.state.getNextStep(this.params),
    };
  }
}

export default InitialTransformation;
