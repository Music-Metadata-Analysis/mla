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
  const mockUserName = "user1234";
  const mockAPIResponse = { data: "mocked data" };
  const integrationType = "LAST.FM";
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
        expect(mockDispatch).toBeCalledTimes(2);
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "StartFetchUser",
          userName: mockUserName,
          integration: integrationType,
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "SuccessFetchUser",
          userName: mockUserName,
          data: mockAPIResponse,
          integration: integrationType,
        });
      });

      it("should register events correctly", async () => {
        expect(mockDispatch).toBeCalledTimes(2);
        expect(mockEvent).toHaveBeenCalledWith(
          Events.LastFM.RequestAlbumsReport
        );
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
        expect(mockDispatch).toBeCalledTimes(2);
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "StartFetchUser",
          userName: mockUserName,
          integration: integrationType,
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "RatelimitedFetchUser",
          userName: mockUserName,
          integration: integrationType,
        });
      });

      it("should register events correctly", async () => {
        expect(mockEvent).toBeCalledTimes(2);
        expect(mockEvent).toHaveBeenCalledWith(
          Events.LastFM.RequestAlbumsReport
        );
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
        expect(mockDispatch).toBeCalledTimes(2);
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "StartFetchUser",
          userName: mockUserName,
          integration: integrationType,
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "FailureFetchUser",
          userName: mockUserName,
          integration: integrationType,
        });
      });

      it("should register events correctly", async () => {
        expect(mockEvent).toBeCalledTimes(2);
        expect(mockEvent).toHaveBeenCalledWith(
          Events.LastFM.RequestAlbumsReport
        );
        expect(mockEvent).toHaveBeenCalledWith(Events.LastFM.ErrorAlbumsReport);
      });
    });
  });
});
