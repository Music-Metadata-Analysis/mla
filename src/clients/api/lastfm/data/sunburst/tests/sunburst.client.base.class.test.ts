import SunBurstDataClientBase from "../sunburst.client.base.class";
import apiRoutes from "@src/config/apiRoutes";
import EventDefinition from "@src/contracts/events/event.class";
import InitialState from "@src/providers/user/user.initial";

const mockDataPointClasses = [jest.fn(), jest.fn()];

class ConcreteSunBurstDataClientBase extends SunBurstDataClientBase<unknown> {
  dataPointClasses = mockDataPointClasses;
  defaultRoute = "/default/route";
  eventType = "PLAYCOUNT BY ARTIST" as const;
}

describe("SunBurstDataClientBase", () => {
  const mockDispatch = jest.fn();
  const mockEvent = jest.fn();
  const mockState = {
    errorMessage: "Mock Error Message",
    lastfmPrefix: "A url to lastfm",
    userProperties: JSON.parse(JSON.stringify(InitialState)),
    getReportContent: jest.fn(),
    getReport: jest.fn(),
    getReportStatus: jest.fn(),
    getDispatchState: jest.fn(),
    updateWithResponse: jest.fn(),
    getProfileImageUrl: jest.fn(),
    getNextStep: jest.fn(),
    throwError: jest.fn(),
    removeEntity: jest.fn(),
  };

  beforeEach(() => jest.resetAllMocks());

  describe("when a concrete instances is instantiated", () => {
    let instance: SunBurstDataClientBase<unknown>;
    const mockParams = { userName: "niall-byrne", artist: "The Cure" };
    const mockDataPointRetrieveReport = jest.fn();

    beforeEach(() => {
      instance = new ConcreteSunBurstDataClientBase(
        mockDispatch,
        mockEvent,
        mockState
      );
    });

    describe("when no operation has been defined", () => {
      beforeEach(() => {
        mockDataPointClasses[0].mockImplementationOnce(() => ({
          getRoute: () => "",
        }));
        mockDataPointClasses[1].mockImplementationOnce(() => ({
          retrieveReport: mockDataPointRetrieveReport,
          getRoute: () => "/default/route",
        }));
        mockState.getReportStatus.mockReturnValue({});

        instance.retrieveReport(mockParams);
      });

      it("should call mockDataPointRetrieveReport as expected on the default route datapoint", () => {
        expect(mockDataPointRetrieveReport).toBeCalledTimes(1);
        expect(mockDataPointRetrieveReport).toBeCalledWith(mockParams);
      });

      it("should emit an analytics report request event", async () => {
        expect(mockEvent).toBeCalledTimes(1);
        expect(mockEvent).toHaveBeenCalledWith(
          new EventDefinition({
            category: "LAST.FM",
            label: "AGGREGATE REQUESTS",
            action: `${instance.eventType}: AGGREGATE REQUESTS BEING SENT TO LAST.FM.`,
          })
        );
      });
    });

    describe("when a valid operation is pending on the report", () => {
      beforeEach(() => {
        mockDataPointClasses[0].mockImplementationOnce(() => ({
          getRoute: () => "",
        }));
        mockDataPointClasses[1].mockImplementationOnce(() => ({
          retrieveReport: mockDataPointRetrieveReport,
          getRoute: () => apiRoutes.v2.data.artists.albumsGet,
        }));
        mockState.getReportStatus.mockReturnValue({
          operation: {
            url: apiRoutes.v2.data.artists.albumsGet,
            params: { userName: "niall-byrne", artist: "Uchu Corbini" },
          },
        });
        instance.retrieveReport(mockParams);
      });

      it("should call mockDataPointRetrieveReport as expected on the matching datapoint", () => {
        expect(mockDataPointRetrieveReport).toBeCalledTimes(1);
        expect(mockDataPointRetrieveReport).toBeCalledWith({
          userName: "niall-byrne",
          artist: "Uchu Corbini",
        });
      });

      it("should NOT emit an analytics event", async () => {
        expect(mockEvent).toBeCalledTimes(0);
      });
    });

    describe("when a invalid operation is pending on the report", () => {
      beforeEach(() => {
        mockDataPointClasses[0].mockImplementationOnce(() => ({
          getRoute: () => "unknown-route",
        }));
        mockDataPointClasses[1].mockImplementationOnce(() => ({
          getRoute: () => "unknown-route",
        }));
        mockState.getReportStatus.mockReturnValue({
          operation: {
            url: apiRoutes.v2.data.artists.albumsGet,
          },
        });
        instance.retrieveReport(mockParams);
      });

      it("should call throwError as expected", () => {
        expect(mockState.throwError).toBeCalledTimes(1);
        expect(mockState.throwError).toBeCalledWith();
      });

      it("should NOT emit an analytics event", async () => {
        expect(mockEvent).toBeCalledTimes(0);
      });
    });
  });
});
