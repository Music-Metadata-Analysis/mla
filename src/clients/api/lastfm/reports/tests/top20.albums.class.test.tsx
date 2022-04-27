import apiRoutes from "../../../../../config/apiRoutes";
import LastFMReport from "../top20.albums.class";

jest.mock("../../../api.client.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      post: mockPost,
    };
  });
});

const mockPost = jest.fn();

describe("LastFMTopAlbumsReport", () => {
  const mockDispatch = jest.fn();
  const mockEvent = jest.fn();
  let instance: LastFMReport;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return new LastFMReport(mockDispatch, mockEvent);
  };

  describe("when a request returns not found", () => {
    beforeEach(() => {
      instance = arrange();
    });

    it("should have the correct api route configured", () => {
      expect(instance.route).toBe(apiRoutes.v2.reports.lastfm.top20albums);
    });

    it("should have the correct integration configured", () => {
      expect(instance.integration).toBe("LAST.FM");
    });

    it("should have the correct event type configured", () => {
      expect(instance.eventType).toBe("TOP20 ALBUMS");
    });
  });
});
