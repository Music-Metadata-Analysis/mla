import ReactGA from "react-ga";
import Events from "../../../../events/events";
import { isProduction } from "../../../../utils/env";
import VendorReactGA from "../react.ga.class";

jest.mock("react-ga", () => ({
  __esModule: true,
  default: {
    event: jest.fn(),
    initialize: jest.fn(),
    pageview: jest.fn(),
    set: jest.fn(),
  },
}));

jest.mock("../../../../utils/env", () => ({
  __esModule: true,
  isProduction: jest.fn(),
}));

describe(VendorReactGA.name, () => {
  let instance: VendorReactGA;
  const mockEvent = Events.General.Test;
  const mockAnalyticsID = "mockAnalyticsID";
  const mockUrl = "/mockUrl";

  const arrange = () => (instance = new VendorReactGA());

  beforeEach(() => jest.clearAllMocks());

  describe("when instantiated", () => {
    beforeEach(() => arrange());

    it("should have the correct vendor assigned", () => {
      expect(instance.vendor).toBe(ReactGA);
    });

    describe("event", () => {
      beforeEach(() => instance.event(mockEvent));

      it("should send the event to GoogleAnalytics", () => {
        expect(ReactGA.event).toBeCalledTimes(1);
        expect(ReactGA.event).toBeCalledWith(mockEvent);
      });
    });

    describe("initialize", () => {
      describe("when running in Production", () => {
        beforeEach(() => {
          (isProduction as jest.Mock).mockReturnValueOnce(true);
          instance.initialize(mockAnalyticsID);
        });

        it("should initialize the service without debugging", () => {
          expect(ReactGA.initialize).toBeCalledTimes(1);
          expect(ReactGA.initialize).toBeCalledWith(mockAnalyticsID, {
            debug: false,
          });
        });
      });

      describe("when NOT running in Production", () => {
        beforeEach(() => {
          (isProduction as jest.Mock).mockReturnValueOnce(false);
          instance.initialize(mockAnalyticsID);
        });

        it("should initialize the service with debugging", () => {
          expect(ReactGA.initialize).toBeCalledTimes(1);
          expect(ReactGA.initialize).toBeCalledWith(mockAnalyticsID, {
            debug: true,
          });
        });
      });
    });

    describe("routeChange", () => {
      beforeEach(() => instance.routeChange(mockUrl));

      it("should send the event to GoogleAnalytics", () => {
        expect(ReactGA.set).toBeCalledTimes(1);
        expect(ReactGA.pageview).toBeCalledTimes(1);
        expect(ReactGA.set).toBeCalledWith({ page: mockUrl });
        expect(ReactGA.pageview).toBeCalledWith(mockUrl);
      });
    });
  });
});