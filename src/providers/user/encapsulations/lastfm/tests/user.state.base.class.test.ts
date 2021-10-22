import UserBaseState from "../user.state.base.class";
import type { LastFMImageDataInterface } from "../../../../../types/integrations/lastfm/api.types";
import type { LastFMUserStateBase } from "../../../../../types/user/state.types";
import type { UserStateInterface } from "../../../../../types/user/state.types";

const mockUrls = ["http://someurl1.com", "http://someurl2.com"];

const baseUserProperties: UserStateInterface = {
  data: {
    integration: null,
    report: {
      image: [
        {
          size: "large" as const,
          "#text": mockUrls[1],
        },
      ],
    },
  },
  error: null,
  inProgress: false,
  profileUrl: null,
  ready: true,
  userName: null,
};

describe("UserAlbumState", () => {
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
    beforeEach(() => (size = "large"));

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
