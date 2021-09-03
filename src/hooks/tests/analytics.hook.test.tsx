import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import ReactGA from "react-ga";
import Events from "../../config/events";
import { AnalyticsContext } from "../../providers/analytics/analytics.provider";
import Event from "../../providers/analytics/event.class";
import useAnalytics from "../analytics";
import type { AnalyticsContextInterface } from "../../types/analytics.types";
import type { MutableEnv } from "../../types/process.types";

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
  const mockMouseEvent = {
    currentTarget: {},
  } as React.MouseEvent<HTMLInputElement>;
  const mockButtonName = "MockButtonName";
  const mockButtonClickEvent = new Event({
    action: `CLICKED: ${mockButtonName}`,
    category: "MAIN",
    label: "BUTTON",
  });

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

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange({
        initialized: false,
        setInitialized: mockSetInitialized,
      });
    });

    it("should contain the correct functions", () => {
      expect(received.result.current.setup).toBeInstanceOf(Function);
      expect(received.result.current.event).toBeInstanceOf(Function);
      expect(received.result.current.trackButtonClick).toBeInstanceOf(Function);
    });
  });

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

        describe("setup", () => {
          beforeEach(() => received.result.current.setup());

          it("should NOT initialize analytics", async () => {
            expect(ReactGA.initialize).toBeCalledTimes(0);
          });

          it("should NOT set initialized to true", async () => {
            expect(mockSetInitialized).toHaveBeenCalledTimes(0);
          });
        });

        describe("event", () => {
          beforeEach(() => received.result.current.event(Events.General.Test));

          it("should NOT process events", async () => {
            expect(ReactGA.event).toBeCalledTimes(0);
          });
        });

        describe("buttonClick", () => {
          beforeEach(() => {
            received.result.current.trackButtonClick(
              mockMouseEvent,
              mockButtonName
            );
          });

          it("should NOT process events", async () => {
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

          describe("setup", () => {
            beforeEach(() => received.result.current.setup());

            it("should initialize analytics (with debug disabled)", async () => {
              expect(ReactGA.initialize).toBeCalledTimes(1);
              expect(ReactGA.initialize).toHaveBeenCalledWith(
                process.env.REACT_APP_UA_CODE,
                { debug: expectedDebugMode }
              );
            });

            it("should set initialized to true", async () => {
              expect(mockSetInitialized).toHaveBeenCalledTimes(1);
              expect(mockSetInitialized).toHaveBeenCalledWith(true);
            });
          });

          describe("event", () => {
            beforeEach(() =>
              received.result.current.event(Events.General.Test)
            );

            it("should NOT process events", async () => {
              expect(ReactGA.event).toBeCalledTimes(0);
            });
          });

          describe("buttonClick", () => {
            beforeEach(() => {
              received.result.current.trackButtonClick(
                mockMouseEvent,
                mockButtonName
              );
            });

            it("should NOT process events", async () => {
              expect(ReactGA.event).toBeCalledTimes(0);
            });
          });
        });
      });

      describe("when analytics is initialized", () => {
        beforeEach(() => {
          received = arrange({
            initialized: true,
            setInitialized: mockSetInitialized,
          });
        });

        describe("setup", () => {
          beforeEach(() => received.result.current.setup());

          it("should NOT initialize analytics", async () => {
            expect(ReactGA.initialize).toBeCalledTimes(0);
          });

          it("should NOT set initialized to true", async () => {
            expect(mockSetInitialized).toHaveBeenCalledTimes(0);
          });

          it("should start listening to router events", async () => {
            expect(routerEventListener).toHaveBeenCalledTimes(1);
          });

          it("should respond to a router event by publishing the details", async () => {
            const fakeUrl = "127.0.0.1/fake";

            expect(routerEventListener).toHaveBeenCalledTimes(1);
            const handler = routerEventListener.mock.calls[0][1];

            handler(fakeUrl);

            expect(ReactGA.set).toBeCalledTimes(1);
            expect(ReactGA.set).toBeCalledWith({ page: fakeUrl });

            expect(ReactGA.pageview).toBeCalledTimes(1);
            expect(ReactGA.pageview).toBeCalledWith(fakeUrl);
          });
        });

        describe("event", () => {
          beforeEach(() => received.result.current.event(Events.General.Test));

          it("should process events", async () => {
            expect(ReactGA.event).toBeCalledTimes(1);
            expect(ReactGA.event).toBeCalledWith(Events.General.Test);
          });
        });

        describe("buttonClick", () => {
          beforeEach(() => {
            received.result.current.trackButtonClick(
              mockMouseEvent,
              mockButtonName
            );
          });

          it("should process events as expected", async () => {
            expect(ReactGA.event).toBeCalledTimes(1);
            expect(ReactGA.event).toBeCalledWith(mockButtonClickEvent);
          });
        });
      });
    });
  });

  describe("when NOT in production", () => {
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

        describe("setup", () => {
          beforeEach(() => received.result.current.setup());

          it("should NOT initialize analytics", async () => {
            expect(ReactGA.initialize).toBeCalledTimes(0);
          });

          it("should NOT set initialized to true", async () => {
            expect(mockSetInitialized).toHaveBeenCalledTimes(0);
          });
        });

        describe("event", () => {
          beforeEach(() => received.result.current.event(Events.General.Test));

          it("should NOT process events", async () => {
            expect(ReactGA.event).toBeCalledTimes(0);
          });
        });

        describe("buttonClick", () => {
          beforeEach(() => {
            received.result.current.trackButtonClick(
              mockMouseEvent,
              mockButtonName
            );
          });

          it("should NOT process events", async () => {
            expect(ReactGA.event).toBeCalledTimes(0);
          });
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

        describe("setup", () => {
          beforeEach(() => received.result.current.setup());

          it("should initialize analytics (with debug enabled)", async () => {
            expect(ReactGA.initialize).toBeCalledTimes(1);
            expect(ReactGA.initialize).toHaveBeenCalledWith(
              process.env.REACT_APP_UA_CODE,
              { debug: expectedDebugMode }
            );
          });
        });
      });
    });
  });
});
