import { waitFor } from "@testing-library/react";
import EventDefinition from "../../../../../events/event.class";
import LastFMReport from "../lastfm.base.class";
import type { LastFMTopAlbumsReportResponseInterface } from "../../../../../types/clients/api/reports/lastfm.client.types";

jest.mock("../../../api.client.class", () => {
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
  const reportType = "BASE REPORT";
  const mockDispatch = jest.fn();
  const mockEvent = jest.fn();
  let instance: LastFMReport<LastFMTopAlbumsReportResponseInterface>;
  const requestEvent = new EventDefinition({
    category: "LAST.FM",
    label: "REQUEST",
    action: `${reportType}: REQUEST WAS SENT TO LAST.FM.`,
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

  const setUpRetrieve = (success: boolean, status: number, headers = {}) => {
    if (success) {
      mockPost.mockResolvedValueOnce({
        status: status,
        headers: headers,
        response: mockAPIResponse,
      });
    } else {
      mockPost.mockRejectedValueOnce({});
    }
  };

  describe("retrieveReport", () => {
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
            category: "LAST.FM",
            label: "RESPONSE",
            action: `${reportType}: RECEIVED REPORT FROM LAST.FM.`,
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
            category: "LAST.FM",
            label: "ERROR",
            action: `${reportType}: ERROR CREATING REPORT.`,
          })
        );
      });
    });

    describe("when a request is unauthorized", () => {
      beforeEach(() => {
        setUpRetrieve(true, 401);
        instance = arrange();
        instance.retrieveReport(mockUserName);
      });

      checkUrl();

      it("should dispatch the reducer correctly", async () => {
        expect(mockDispatch).toBeCalledTimes(2);
        expect(mockEvent).toHaveBeenCalledWith(requestEvent);
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "UnauthorizedFetchUser",
          userName: mockUserName,
          integration: integrationType,
        });
      });

      it("should register events correctly", async () => {
        expect(mockEvent).toBeCalledTimes(2);
        expect(mockEvent).toHaveBeenCalledWith(requestEvent);
        expect(mockEvent).toHaveBeenCalledWith(
          new EventDefinition({
            category: "LAST.FM",
            label: "ERROR",
            action: `${reportType}: AN UNAUTHORIZED REPORT REQUEST WAS MADE.`,
          })
        );
      });
    });

    describe("when a request returns not found", () => {
      beforeEach(() => {
        setUpRetrieve(true, 404);
        instance = arrange();
        instance.retrieveReport(mockUserName);
      });

      it("should dispatch the reducer correctly", async () => {
        expect(mockDispatch).toBeCalledTimes(2);
        expect(mockEvent).toHaveBeenCalledWith(requestEvent);
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
            category: "LAST.FM",
            label: "ERROR",
            action: `${reportType}: REQUEST WAS MADE FOR AN UNKNOWN USERNAME.`,
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
        expect(mockEvent).toHaveBeenCalledWith(requestEvent);
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
            category: "LAST.FM",
            label: "ERROR",
            action: `${reportType}: REQUEST WAS RATELIMITED BY LAST.FM.`,
          })
        );
      });
    });

    describe("when a request time out", () => {
      describe("with a retry header", () => {
        beforeEach(async () => {
          setUpRetrieve(true, 503, { "retry-after": "0" });
          instance = arrange();
          instance.retrieveReport(mockUserName);
          await waitForBackoff();
        });

        const waitForBackoff = async () => {
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
        };

        checkUrl();

        it("should dispatch the reducer correctly", async () => {
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "StartFetchUser",
            userName: mockUserName,
            integration: integrationType,
          });
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "TimeoutFetchUser",
            userName: mockUserName,
            integration: integrationType,
          });
        });

        it("should NOT register events", async () => {
          expect(mockEvent).toBeCalledTimes(1);
          expect(mockEvent).toHaveBeenCalledWith(requestEvent);
        });
      });

      describe("without a retry header", () => {
        beforeEach(() => {
          setUpRetrieve(true, 503);
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

        it("should NOT register events", async () => {
          expect(mockEvent).toBeCalledTimes(2);
          expect(mockEvent).toHaveBeenCalledWith(requestEvent);
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "FailureFetchUser",
            userName: mockUserName,
            integration: integrationType,
          });
        });
      });
    });
  });
});
