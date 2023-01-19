import ReactGA from "react-ga";
import VendorReactGA from "../react.ga.class";
import { isProduction } from "@src/utilities/generics/env";
import type { AnalyticsEventDefinitionInterface } from "@src/contracts/analytics/types/event.types";

jest.mock("react-ga", () => ({
  event: jest.fn(),
  initialize: jest.fn(),
  pageview: jest.fn(),
  set: jest.fn(),
}));

jest.mock("@src/utilities/generics/env");

const MockedIsProduction = jest.mocked(isProduction);

describe(VendorReactGA.name, () => {
  let instance: VendorReactGA;
  const mockEvent = {
    category: "TEST",
    label: "TEST",
    action: "Just a test analytics action.",
  } as AnalyticsEventDefinitionInterface;
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
          MockedIsProduction.mockReturnValueOnce(true);
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
          MockedIsProduction.mockReturnValueOnce(false);
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
