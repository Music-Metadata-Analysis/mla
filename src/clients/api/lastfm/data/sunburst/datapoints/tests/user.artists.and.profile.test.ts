import UserArtistsAndProfile from "../user.artists.and.profile";
import LastFMReportBaseClient from "@src/clients/api/lastfm/lastfm.api.client.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type UserSunBurstReportBaseState from "@src/providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";

describe("UserArtistsAndProfile", () => {
  const mockDispatch = jest.fn();
  const mockEvent = jest.fn();
  const mockEncapsulation =
    jest.fn() as unknown as UserSunBurstReportBaseState<unknown>;
  let instance: UserArtistsAndProfile<unknown>;

  const arrange = () => {
    return new UserArtistsAndProfile(
      mockDispatch,
      mockEvent,
      mockEncapsulation
    );
  };

  describe("when a request returns not found", () => {
    beforeEach(() => {
      instance = arrange();
    });

    it("should be an instance of the LastFMBaseClient abstract base class", () => {
      expect(instance).toBeInstanceOf(LastFMReportBaseClient);
    });

    it("should have the correct api route configured", () => {
      expect(instance.route).toBe(apiRoutes.v2.reports.lastfm.top20artists);
    });
  });
});
