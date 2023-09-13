import type { LastFMImageDataInterface } from "@src/web/api/lastfm/types/lastfm.api.response.types";
import type { LastFMReportStateBase } from "@src/web/reports/lastfm/generics/types/state/providers/lastfm.report.state.types";

export default class LastFMReportBaseStateEncapsulation {
  reportProperties: LastFMReportStateBase;

  constructor(reportProperties: LastFMReportStateBase) {
    this.reportProperties = JSON.parse(JSON.stringify(reportProperties));
  }

  getProfileImageUrl = (size: LastFMImageDataInterface["size"]) => {
    let userProfileUrl = "";
    const profileImage = this.reportProperties.data.report.image;
    const image = profileImage.find((thisImage) => thisImage.size == size);
    if (image) userProfileUrl = image["#text"];
    return userProfileUrl;
  };
}
