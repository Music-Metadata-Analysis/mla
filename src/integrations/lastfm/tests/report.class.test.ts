import Events from "../../../config/events";
import LastFMReportRequest from "../report.class";

const mockPost = jest.fn();
jest.mock("../../../utils/http.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      post: mockPost,
    };
  });
});

describe("LastFMReportRequest", () => {
  let mockUserName = "user1234";
  let mockAPIResponse = { data: "mocked data" };
  const mockDispatch = jest.fn();
  const mockEvent = jest.fn();
  let instance: LastFMReportRequest;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setUpRetrieve = (success: boolean, status: number) => {
    if (success) {
      mockPost.mockResolvedValueOnce({
        status: status,
        response: mockAPIResponse,
      });
    } else {
      mockPost.mockRejectedValueOnce({});
    }
  };

  const arrange = () => {
    return new LastFMReportRequest(mockDispatch, mockEvent);
  };

  describe("retrieveTop20", () => {
    describe("when a request is successful", () => {
      beforeEach(() => {
        setUpRetrieve(true, 200);
        instance = arrange();
        instance.retrieveAlbumReport(mockUserName);
      });

      it("should dispatch the reducer correctly", async () => {
        expect(mockDispatch).toBeCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "SuccessFetchUser",
          userName: mockUserName,
          data: mockAPIResponse,
        });
      });

      it("should register events correctly", async () => {
        expect(mockDispatch).toBeCalledTimes(1);
        expect(mockEvent).toHaveBeenCalledWith(
          Events.LastFM.SuccessAlbumsReport
        );
      });
    });

    describe("when a request is ratelimited", () => {
      beforeEach(() => {
        setUpRetrieve(true, 429);
        instance = arrange();
        instance.retrieveAlbumReport(mockUserName);
      });

      it("should dispatch the reducer correctly", async () => {
        expect(mockDispatch).toBeCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "RatelimitedFetchUser",
          userName: mockUserName,
        });
      });

      it("should register events correctly", async () => {
        expect(mockEvent).toBeCalledTimes(1);
        expect(mockEvent).toHaveBeenCalledWith(Events.LastFM.Ratelimited);
      });
    });

    describe("when a request fails", () => {
      beforeEach(() => {
        setUpRetrieve(false, 400);
        instance = arrange();
        instance.retrieveAlbumReport(mockUserName);
      });

      it("should dispatch the reducer correctly", async () => {
        expect(mockDispatch).toBeCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "FailureFetchUser",
          userName: mockUserName,
        });
      });

      it("should register events correctly", async () => {
        expect(mockEvent).toBeCalledTimes(1);
        expect(mockEvent).toHaveBeenCalledWith(Events.LastFM.ErrorAlbumsReport);
      });
    });
  });
});
