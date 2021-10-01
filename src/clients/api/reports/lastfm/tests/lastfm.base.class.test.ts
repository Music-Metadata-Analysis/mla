import EventDefinition from "../../../../../events/event.class";
import LastFMReport from "../lastfm.base.class";
import type { LastFMTopAlbumsReportResponseInterface } from "../../../../../types/clients/api/reports/lastfm.types";

jest.mock("../../../../http.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      post: mockPost,
    };
  });
});

const mockPost = jest.fn();

describe("LastFMReport", () => {
  const mockUserName = "user1234";
  const mockAPIResponse = { data: "mocked data" };
  const integrationType = "LAST.FM";
  const reportType = "BaseType";
  const mockDispatch = jest.fn();
  const mockEvent = jest.fn();
  let instance: LastFMReport<LastFMTopAlbumsReportResponseInterface>;
  const requestEvent = new EventDefinition({
    category: "LASTFM",
    label: "REQUEST",
    action: `${reportType}: Request was sent to LAST.FM.`,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return new LastFMReport<LastFMTopAlbumsReportResponseInterface>(
      mockDispatch,
      mockEvent
    );
  };

  const checkUrl = () => {
    it("should make the request with the correct url", () => {
      expect(mockPost).toBeCalledTimes(1);
      expect(mockPost).toBeCalledWith(instance.route, {
        userName: mockUserName,
      });
    });
  };

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

  describe("retrieveTop20", () => {
    describe("when a request returns not found", () => {
      beforeEach(() => {
        setUpRetrieve(true, 404);
        instance = arrange();
        instance.retrieveReport(mockUserName);
      });

      it("should dispatch the reducer correctly", async () => {
        expect(mockDispatch).toBeCalledTimes(2);
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "StartFetchUser",
          userName: mockUserName,
          integration: integrationType,
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "NotFoundFetchUser",
          userName: mockUserName,
          integration: integrationType,
        });
      });

      it("should register events correctly", async () => {
        expect(mockEvent).toBeCalledTimes(2);
        expect(mockEvent).toHaveBeenCalledWith(requestEvent);
        expect(mockEvent).toHaveBeenCalledWith(
          new EventDefinition({
            category: "LASTFM",
            label: "ERROR",
            action: `${reportType}: Request was made for an unknown username.`,
          })
        );
      });
    });

    describe("when a request is successful", () => {
      beforeEach(() => {
        setUpRetrieve(true, 200);
        instance = arrange();
        instance.retrieveReport(mockUserName);
      });

      checkUrl();

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
        expect(mockEvent).toHaveBeenCalledWith(requestEvent);
        expect(mockEvent).toHaveBeenCalledWith(
          new EventDefinition({
            category: "LASTFM",
            label: "RESPONSE",
            action: `${reportType}: Received report from LAST.FM.`,
          })
        );
      });
    });

    describe("when a request is ratelimited", () => {
      beforeEach(() => {
        setUpRetrieve(true, 429);
        instance = arrange();
        instance.retrieveReport(mockUserName);
      });

      checkUrl();

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
        expect(mockEvent).toHaveBeenCalledWith(requestEvent);
        expect(mockEvent).toHaveBeenCalledWith(
          new EventDefinition({
            category: "LASTFM",
            label: "ERROR",
            action: `${reportType}: Request was ratelimited by LAST.FM.`,
          })
        );
      });
    });

    describe("when a request fails", () => {
      beforeEach(() => {
        setUpRetrieve(false, 400);
        instance = arrange();
        instance.retrieveReport(mockUserName);
      });

      checkUrl();

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
        expect(mockEvent).toHaveBeenCalledWith(requestEvent);
        expect(mockEvent).toHaveBeenCalledWith(
          new EventDefinition({
            category: "LASTFM",
            label: "ERROR",
            action: `${reportType}: Unable to create a report.`,
          })
        );
      });
    });
  });
});
