import { baseUserProperties, mockUrls } from "./states/user.state.data.set";
import UserBaseState from "../user.state.base.class";
import type { LastFMImageDataInterface } from "@src/types/clients/api/lastfm/response.types";
import type { LastFMUserStateBase } from "@src/types/user/state.types";

describe("UserBaseState", () => {
  let currentState: LastFMUserStateBase;
  let instance: UserBaseState;
  let size: LastFMImageDataInterface["size"];

  const resetState = () => {
    currentState = JSON.parse(JSON.stringify(baseUserProperties));
  };

  const arrange = () => {
    instance = new UserBaseState(currentState);
  };

  beforeEach(() => {
    resetState();
  });

  describe("with a VALID size", () => {
    beforeEach(() => (size = "small"));

    describe("getProfileImageUrl", () => {
      beforeEach(() => arrange());

      it("should return the expected url", () => {
        expect(instance.getProfileImageUrl(size)).toBe(mockUrls[1]);
      });
    });
  });

  describe("with a INVALID size", () => {
    beforeEach(
      () => (size = "not-a-valid_size" as LastFMImageDataInterface["size"])
    );

    describe("getProfileImageUrl", () => {
      beforeEach(() => arrange());

      it("should return the expected url", () => {
        expect(instance.getProfileImageUrl(size)).toBe("");
      });
    });
  });
});
