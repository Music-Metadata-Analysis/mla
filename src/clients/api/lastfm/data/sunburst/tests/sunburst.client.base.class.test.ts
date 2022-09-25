import SunBurstDataClientBase from "../sunburst.client.base.class";
import apiRoutes from "@src/config/apiRoutes";
import InitialState from "@src/providers/user/user.initial";

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

class ConcreteSunBurstDataClientBase extends SunBurstDataClientBase<unknown> {
  dataPointClasses = [jest.fn(), jest.fn()];
  defaultRoute = "/default/route";
}

describe("SunBurstDataClientBase", () => {
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
        (instance.dataPointClasses[1] as jest.Mock).mockImplementation(() => ({
          retrieveReport: mockDataPointRetrieveReport,
          route: "/default/route",
        }));
        mockState.getReportStatus.mockImplementation(() => ({}));
        instance.retrieveReport(mockParams);
      });

      it("should call mockDataPointRetrieveReport as expected on the default route datapoint", () => {
        expect(mockDataPointRetrieveReport).toBeCalledTimes(1);
        expect(mockDataPointRetrieveReport).toBeCalledWith(mockParams);
      });
    });

    describe("when a valid operation is pending on the report", () => {
      beforeEach(() => {
        (instance.dataPointClasses[0] as jest.Mock).mockImplementation(() => ({
          retrieveReport: mockDataPointRetrieveReport,
          route: apiRoutes.v2.data.artists.albumsGet,
        }));
        mockState.getReportStatus.mockImplementation(() => ({
          operation: {
            url: apiRoutes.v2.data.artists.albumsGet,
            params: { userName: "niall-byrne", artist: "Uchu Corbini" },
          },
        }));
        instance.retrieveReport(mockParams);
      });

      it("should call mockDataPointRetrieveReport as expected on the matching datapoint", () => {
        expect(mockDataPointRetrieveReport).toBeCalledTimes(1);
        expect(mockDataPointRetrieveReport).toBeCalledWith({
          userName: "niall-byrne",
          artist: "Uchu Corbini",
        });
      });
    });

    describe("when a invalid operation is pending on the report", () => {
      beforeEach(() => {
        (instance.dataPointClasses[0] as jest.Mock).mockImplementation(() => ({
          retrieveReport: mockDataPointRetrieveReport,
          route: "unknown-route",
        }));
        mockState.getReportStatus.mockImplementation(() => ({
          operation: {
            url: apiRoutes.v2.data.artists.albumsGet,
          },
        }));
        instance.retrieveReport(mockParams);
      });

      it("should call throwError as expected", () => {
        expect(mockState.throwError).toBeCalledTimes(1);
        expect(mockState.throwError).toBeCalledWith();
      });
    });
  });
});
