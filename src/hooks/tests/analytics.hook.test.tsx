import ReactGA from "react-ga";
import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import useAnalytics from "../analytics";
import { AnalyticsContext } from "../../providers/analytics/analytics.provider";
import { AnalyticsContextInterface } from "../../types/analytics.types";
import Events from "../../config/events";
import { MutableEnv } from "../../types/process.types";

jest.mock("react-ga");
jest.mock("next/router");

interface MockAnalyticsContextWithChildren {
  children?: React.ReactNode;
  mockContext: AnalyticsContextInterface;
}

describe("useAnalytics", () => {
  let expectedDebugMode: boolean;
  let mockSetInitialized: jest.Mock;
  let originalEnvironment: typeof process.env;
  let received: ReturnType<typeof arrange>;
  const routerEventListener = jest.fn();

  beforeAll(() => {
    originalEnvironment = process.env;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(require("next/router"), "useRouter").mockImplementation(() => {
      return { events: { on: routerEventListener } };
    });
    mockSetInitialized = jest.fn();
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  const providerWrapper = ({
    children,
    mockContext,
  }: MockAnalyticsContextWithChildren) => {
    return (
      <AnalyticsContext.Provider value={mockContext}>
        {children}
      </AnalyticsContext.Provider>
    );
  };

  const arrange = (providerProps: AnalyticsContextInterface) => {
    return renderHook(() => useAnalytics(), {
      wrapper: providerWrapper,
      initialProps: {
        mockContext: providerProps,
      },
    });
  };

  describe("when in production", () => {
    beforeAll(() => {
      expectedDebugMode = false;
      (process.env as MutableEnv).NODE_ENV = "production";
    });

    describe("without a valid tracker code", () => {
      beforeAll(() => {
        process.env.REACT_APP_UA_CODE = "";
      });

      describe("when initialized", () => {
        beforeEach(() => {
          received = arrange({
            initialized: false,
            setInitialized: mockSetInitialized,
          });
        });

        it("should contain the correct functions", () => {
          expect(received.result.current.setup).toBeInstanceOf(Function);
          expect(received.result.current.event).toBeInstanceOf(Function);
        });

        it("should NOT intialize analytics when setup is called", async () => {
          received.result.current.setup();
          expect(ReactGA.initialize).toBeCalledTimes(0);
        });

        it("should NOT set intialized to true when setup is called", async () => {
          received.result.current.setup();
          expect(mockSetInitialized).toHaveBeenCalledTimes(0);
        });

        it("should NOT process events when event is called", async () => {
          received.result.current.event(Events.General.Test);
          expect(ReactGA.event).toBeCalledTimes(0);
        });
      });
    });

    describe("with a valid tracker code", () => {
      beforeAll(() => {
        process.env.REACT_APP_UA_CODE = "tracker code";
      });

      describe("when not initialized", () => {
        beforeEach(() => {
          received = arrange({
            initialized: false,
            setInitialized: mockSetInitialized,
          });
        });

        it("should contain the correct functions", () => {
          expect(received.result.current.setup).toBeInstanceOf(Function);
          expect(received.result.current.event).toBeInstanceOf(Function);
        });

        it("should intialize analytics when setup is called", async () => {
          received.result.current.setup();
          expect(ReactGA.initialize).toBeCalledTimes(1);
          expect(ReactGA.initialize).toHaveBeenCalledWith(
            process.env.REACT_APP_UA_CODE,
            { debug: expectedDebugMode }
          );
        });

        it("should set intialized to true when setup is called", async () => {
          received.result.current.setup();
          expect(mockSetInitialized).toHaveBeenCalledTimes(1);
          expect(mockSetInitialized).toHaveBeenCalledWith(true);
        });

        it("should NOT process events when event is called", async () => {
          received.result.current.event(Events.General.Test);
          expect(ReactGA.event).toBeCalledTimes(0);
        });
      });

      describe("when analytics is initialized", () => {
        beforeEach(() => {
          received = arrange({
            initialized: true,
            setInitialized: mockSetInitialized,
          });
        });

        it("should contain the correct functions", () => {
          expect(received.result.current.setup).toBeInstanceOf(Function);
          expect(received.result.current.event).toBeInstanceOf(Function);
        });

        it("should NOT intialize analytics when setup is called", async () => {
          received.result.current.setup();
          expect(ReactGA.initialize).toBeCalledTimes(0);
        });

        it("should NOT set intialized to true when setup is called", async () => {
          received.result.current.setup();
          expect(mockSetInitialized).toHaveBeenCalledTimes(0);
        });

        it("should start listening to router events", async () => {
          received.result.current.setup();
          expect(routerEventListener).toHaveBeenCalledTimes(1);
        });

        it("should respond to a router event by publishing the details", async () => {
          const fakeUrl = "127.0.0.1/fake";

          received.result.current.setup();
          expect(routerEventListener).toHaveBeenCalledTimes(1);
          const handler = routerEventListener.mock.calls[0][1];

          handler(fakeUrl);

          expect(ReactGA.set).toBeCalledTimes(1);
          expect(ReactGA.set).toBeCalledWith({ page: fakeUrl });

          expect(ReactGA.pageview).toBeCalledTimes(1);
          expect(ReactGA.pageview).toBeCalledWith(fakeUrl);
        });

        it("should process events when event is called", async () => {
          received.result.current.event(Events.General.Test);
          expect(ReactGA.event).toBeCalledTimes(1);
          expect(ReactGA.event).toBeCalledWith(Events.General.Test);
        });
      });
    });
  });

  describe("when in test", () => {
    beforeAll(() => {
      expectedDebugMode = true;
      (process.env as MutableEnv).NODE_ENV = "test";
    });

    describe("without a valid tracker code", () => {
      beforeAll(() => {
        process.env.REACT_APP_UA_CODE = "";
      });

      describe("when not initialized", () => {
        beforeEach(() => {
          received = arrange({
            initialized: false,
            setInitialized: mockSetInitialized,
          });
        });

        it("should contain the correct functions", () => {
          expect(received.result.current.setup).toBeInstanceOf(Function);
          expect(received.result.current.event).toBeInstanceOf(Function);
        });

        it("should NOT intialize analytics when setup is called", async () => {
          received.result.current.setup();
          expect(ReactGA.initialize).toBeCalledTimes(0);
        });

        it("should NOT set intialized to true when setup is called", async () => {
          received.result.current.setup();
          expect(mockSetInitialized).toHaveBeenCalledTimes(0);
        });

        it("should NOT process events when event is called", async () => {
          received.result.current.event(Events.General.Test);
          expect(ReactGA.event).toBeCalledTimes(0);
        });
      });
    });

    describe("with a valid tracker code", () => {
      beforeAll(() => {
        process.env.REACT_APP_UA_CODE = "tracker code";
      });

      describe("when not initialized", () => {
        beforeEach(() => {
          received = arrange({
            initialized: false,
            setInitialized: mockSetInitialized,
          });
        });

        it("should contain the correct functions", () => {
          expect(received.result.current.setup).toBeInstanceOf(Function);
          expect(received.result.current.event).toBeInstanceOf(Function);
        });

        it("should intialize analytics when setup is called", async () => {
          received.result.current.setup();
          expect(ReactGA.initialize).toBeCalledTimes(1);
          expect(ReactGA.initialize).toHaveBeenCalledWith(
            process.env.REACT_APP_UA_CODE,
            { debug: expectedDebugMode }
          );
        });

        it("should set intialized to true when setup is called", async () => {
          received.result.current.setup();
          expect(mockSetInitialized).toHaveBeenCalledTimes(1);
          expect(mockSetInitialized).toHaveBeenCalledWith(true);
        });

        it("should NOT process events when event is called", async () => {
          received.result.current.event(Events.General.Test);
          expect(ReactGA.event).toBeCalledTimes(0);
        });
      });

      describe("when initialized", () => {
        beforeEach(() => {
          received = arrange({
            initialized: true,
            setInitialized: mockSetInitialized,
          });
        });

        it("should contain the correct functions", () => {
          expect(received.result.current.setup).toBeInstanceOf(Function);
          expect(received.result.current.event).toBeInstanceOf(Function);
        });

        it("should NOT intialize analytics when setup is called", async () => {
          received.result.current.setup();
          expect(ReactGA.initialize).toBeCalledTimes(0);
        });

        it("should NOT set intialized to true when setup is called", async () => {
          received.result.current.setup();
          expect(mockSetInitialized).toHaveBeenCalledTimes(0);
        });

        it("should start listening to router events", async () => {
          received.result.current.setup();
          expect(routerEventListener).toHaveBeenCalledTimes(1);
        });

        it("should respond to a router event by publishing the details", async () => {
          const fakeUrl = "127.0.0.1/fake";

          received.result.current.setup();
          expect(routerEventListener).toHaveBeenCalledTimes(1);
          const handler = routerEventListener.mock.calls[0][1];

          handler(fakeUrl);

          expect(ReactGA.set).toBeCalledTimes(1);
          expect(ReactGA.set).toBeCalledWith({ page: fakeUrl });

          expect(ReactGA.pageview).toBeCalledTimes(1);
          expect(ReactGA.pageview).toBeCalledWith(fakeUrl);
        });

        it("should process events when event is called", async () => {
          received.result.current.event(Events.General.Test);
          expect(ReactGA.event).toBeCalledTimes(1);
          expect(ReactGA.event).toBeCalledWith(Events.General.Test);
        });
      });
    });
  });
});
