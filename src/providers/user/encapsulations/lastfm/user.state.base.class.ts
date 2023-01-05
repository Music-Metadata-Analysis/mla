import type { LastFMImageDataInterface } from "@src/types/clients/api/lastfm/response.types";
import type { LastFMUserStateBase } from "@src/types/user/state.types";

export default class UserBaseState {
  userProperties: LastFMUserStateBase;

  constructor(userProperties: LastFMUserStateBase) {
    this.userProperties = JSON.parse(JSON.stringify(userProperties));
  }

  getProfileImageUrl = (size: LastFMImageDataInterface["size"]) => {
    let userProfileUrl = "";
    const profileImage = this.userProperties.data.report.image;
    const image = profileImage.find((thisImage) => thisImage.size == size);
    if (image) userProfileUrl = image["#text"];
    return userProfileUrl;
  };
}
