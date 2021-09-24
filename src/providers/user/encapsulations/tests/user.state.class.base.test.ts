import UserState from "../user.state.base.class";
import type { UserStateInterface } from "../../../../types/user/state.types";

const baseUserProperties: UserStateInterface = {
  data: {
    integration: null,
    report: {
      albums: [],
      image: [],
    },
  },
  error: null,
  inProgress: false,
  profileUrl: null,
  ready: true,
  userName: null,
};

describe("UserState", () => {
  let currentState: UserStateInterface;
  let instance: UserState;
  const mockT = jest.fn((arg: string) => `t(${arg})`);

  const resetState = () => {
    currentState = JSON.parse(JSON.stringify(baseUserProperties));
  };

  const arrange = () => {
    instance = new UserState(currentState, mockT);
  };

  beforeEach(() => {
    resetState();
  });

  describe("when initialized", () => {
    beforeEach(() => arrange());

    it("should have the correct translated default values", () => {
      expect(instance.defaultAlbumName).toBe("t(defaults.albumName)");
      expect(instance.defaultArtistName).toBe("t(defaults.artistName)");
    });
  });
});
