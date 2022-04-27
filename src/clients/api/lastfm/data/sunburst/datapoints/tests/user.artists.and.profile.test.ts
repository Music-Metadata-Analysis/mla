import apiRoutes from "../../../../../../../config/apiRoutes";
import UserArtistsAndProfile from "../user.artists.and.profile";
import type UserSunBurstReportBaseState from "../../../../../../../providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";

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

    it("should have the correct api route configured", () => {
      expect(instance.route).toBe(apiRoutes.v2.reports.lastfm.top20artists);
    });

    it("should have the correct integration configured", () => {
      expect(instance.integration).toBe("LAST.FM");
    });

    it("should have the correct event type configured", () => {
      expect(instance.eventType).toBe("TOP20 ARTISTS");
    });
  });
});
