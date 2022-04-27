import { waitFor } from "@testing-library/react";
import EventDefinition from "../../../../events/event.class";
import LastFMReport from "../lastfm.api.client.base.class";
import type { LastFMTopAlbumsReportResponseInterface } from "../../../../types/clients/api/lastfm/response.types";

jest.mock("../../api.client.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      request: mockRequest,
    };
  });
});

const mockRequest = jest.fn();

describe("LastFMReport", () => {
  const mockParams = { userName: "user1234" };
  const mockAPIResponse = { data: "mocked data" };
  const integrationType = "LAST.FM";
  const reportType = "BASE";
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
    const report = new LastFMReport<LastFMTopAlbumsReportResponseInterface>(
      mockDispatch,
      mockEvent
    );
    report.route = "/api/v2/someroute/:username";
    return report;
  };

  const checkUrl = () => {
    it("should make the request with the correct url", () => {
      expect(mockRequest).toBeCalledTimes(1);
      expect(mockRequest).toBeCalledWith(
        instance.route?.replace(":username", mockParams.userName)
      );
    });
  };

  const setUpRetrieve = (success: boolean, status: number, headers = {}) => {
    if (success) {
      mockRequest.mockResolvedValueOnce({
        status: status,
        headers: headers,
        response: mockAPIResponse,
      });
    } else {
      mockRequest.mockRejectedValueOnce({});
    }
  };

  describe("retrieveReport", () => {
    describe("when a request is successful", () => {
      beforeEach(() => {
        setUpRetrieve(true, 200);
        instance = arrange();
        instance.retrieveReport(mockParams);
      });

      checkUrl();

      it("should dispatch the reducer correctly", async () => {
        await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "StartFetchUser",
          userName: mockParams.userName,
          integration: integrationType,
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "SuccessFetchUser",
          userName: mockParams.userName,
          data: mockAPIResponse,
          integration: integrationType,
        });
      });

      it("should register events correctly", async () => {
        await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
        expect(mockEvent).toHaveBeenCalledWith(requestEvent);
        expect(mockEvent).toHaveBeenCalledWith(
          new EventDefinition({
            category: "LAST.FM",
            label: "RESPONSE",
            action: `${reportType}: RECEIVED RESPONSE FROM LAST.FM.`,
          })
        );
      });
    });

    describe("when a request fails", () => {
      beforeEach(() => {
        setUpRetrieve(false, 400);
        instance = arrange();
        instance.retrieveReport(mockParams);
      });

      checkUrl();

      it("should dispatch the reducer correctly", async () => {
        await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "StartFetchUser",
          userName: mockParams.userName,
          integration: integrationType,
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "FailureFetchUser",
          userName: mockParams.userName,
          integration: integrationType,
        });
      });

      it("should register events correctly", async () => {
        await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
        expect(mockEvent).toHaveBeenCalledWith(requestEvent);
        expect(mockEvent).toHaveBeenCalledWith(
          new EventDefinition({
            category: "LAST.FM",
            label: "ERROR",
            action: `${reportType}: ERROR DURING REQUEST.`,
          })
        );
      });
    });

    describe("when a request is unauthorized", () => {
      beforeEach(() => {
        setUpRetrieve(true, 401);
        instance = arrange();
        instance.retrieveReport(mockParams);
      });

      checkUrl();

      it("should dispatch the reducer correctly", async () => {
        await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "StartFetchUser",
          userName: mockParams.userName,
          integration: integrationType,
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "UnauthorizedFetchUser",
          userName: mockParams.userName,
          integration: integrationType,
        });
      });

      it("should register events correctly", async () => {
        await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
        expect(mockEvent).toHaveBeenCalledWith(requestEvent);
        expect(mockEvent).toHaveBeenCalledWith(
          new EventDefinition({
            category: "LAST.FM",
            label: "ERROR",
            action: `${reportType}: AN UNAUTHORIZED REQUEST WAS MADE.`,
          })
        );
      });
    });

    describe("when a request returns not found", () => {
      beforeEach(() => {
        setUpRetrieve(true, 404);
        instance = arrange();
        instance.retrieveReport(mockParams);
      });

      it("should dispatch the reducer correctly", async () => {
        await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "StartFetchUser",
          userName: mockParams.userName,
          integration: integrationType,
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "NotFoundFetchUser",
          userName: mockParams.userName,
          integration: integrationType,
        });
      });

      it("should register events correctly", async () => {
        await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
        expect(mockEvent).toHaveBeenCalledWith(requestEvent);
        expect(mockEvent).toHaveBeenCalledWith(
          new EventDefinition({
            category: "LAST.FM",
            label: "ERROR",
            action: `${reportType}: REQUEST WAS MADE FOR AN UNKNOWN ENTITY.`,
          })
        );
      });
    });

    describe("when a request is ratelimited", () => {
      beforeEach(() => {
        setUpRetrieve(true, 429);
        instance = arrange();
        instance.retrieveReport(mockParams);
      });

      checkUrl();

      it("should dispatch the reducer correctly", async () => {
        await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "StartFetchUser",
          userName: mockParams.userName,
          integration: integrationType,
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "RatelimitedFetchUser",
          userName: mockParams.userName,
          integration: integrationType,
        });
      });

      it("should register events correctly", async () => {
        await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
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
          instance.retrieveReport(mockParams);
          await waitForBackoff();
        });

        const waitForBackoff = async () => {
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
        };

        checkUrl();

        it("should dispatch the reducer correctly", async () => {
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "StartFetchUser",
            userName: mockParams.userName,
            integration: integrationType,
          });
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "TimeoutFetchUser",
            userName: mockParams.userName,
            integration: integrationType,
          });
        });

        it("should NOT register events", async () => {
          await waitFor(() => expect(mockEvent).toBeCalledTimes(1));
          expect(mockEvent).toBeCalledTimes(1);
          expect(mockEvent).toHaveBeenCalledWith(requestEvent);
        });
      });

      describe("without a retry header", () => {
        beforeEach(() => {
          setUpRetrieve(true, 503);
          instance = arrange();
          instance.retrieveReport(mockParams);
        });

        checkUrl();

        it("should dispatch the reducer correctly", async () => {
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "StartFetchUser",
            userName: mockParams.userName,
            integration: integrationType,
          });
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "FailureFetchUser",
            userName: mockParams.userName,
            integration: integrationType,
          });
        });

        it("should register a failure event", async () => {
          await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
          expect(mockEvent).toHaveBeenCalledWith(requestEvent);
          expect(mockEvent).toHaveBeenCalledWith(
            new EventDefinition({
              category: "LAST.FM",
              label: "ERROR",
              action: `${reportType}: ERROR DURING REQUEST.`,
            })
          );
        });
      });
    });
  });
});
