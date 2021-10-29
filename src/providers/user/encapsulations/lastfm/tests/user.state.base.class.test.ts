import { baseUserProperties, mockUrls } from "./fixtures/mock.user.state.data";
import UserBaseState from "../user.state.base.class";
import type { LastFMImageDataInterface } from "../../../../../types/integrations/lastfm/api.types";
import type { LastFMUserStateBase } from "../../../../../types/user/state.types";

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
