import { act, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import React from "react";
import ReactGA from "react-ga";
import mockUseAnalytics from "./analytics.mock.hook";
import EventDefinition from "../../events/event.class";
import Events from "../../events/events";
import { AnalyticsContext } from "../../providers/analytics/analytics.provider";
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
  const mockButtonClickEvent = new EventDefinition({
    action: `CLICKED: ${mockButtonName}`,
    category: "MAIN",
    label: "BUTTON",
  });
  const mockExternalLink = "http://somewebsite.com";
  const mockExternalLinkClickEvent = new EventDefinition({
    action: `VISITED: ${mockExternalLink}`,
    category: "MAIN",
    label: "EXTERNAL_LINK",
  });
  const mockInternalLink = "http://somewebsite.com";
  const mockInternalLinkClickEvent = new EventDefinition({
    action: `VISITED: ${mockInternalLink}`,
    category: "MAIN",
    label: "INTERNAL_LINK",
  });

  beforeAll(() => {
    originalEnvironment = process.env;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "group").mockImplementation(() => jest.fn());
    jest.spyOn(console, "groupEnd").mockImplementation(() => jest.fn());
    jest.spyOn(console, "log").mockImplementation(() => jest.fn());
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
      expect(received.result.current.trackExternalLinkClick).toBeInstanceOf(
        Function
      );
      expect(received.result.current.trackInternalLinkClick).toBeInstanceOf(
        Function
      );
      expect(Object.keys(received.result.current).length).toBe(5);
    });

    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(mockUseAnalytics).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });
  });

  describe("when in production", () => {
    beforeAll(() => {
      expectedDebugMode = false;
      (process.env as MutableEnv).NODE_ENV = "production";
    });

    describe("without a valid tracker code", () => {
      beforeAll(() => {
        process.env.NEXT_PUBLIC_ANALYTICS_UA_CODE = "";
      });

      describe("when NOT initialized", () => {
        beforeEach(() => {
          received = arrange({
            initialized: false,
            setInitialized: mockSetInitialized,
          });
        });

        describe("setup", () => {
          beforeEach(() => received.result.current.setup());

          it("should NOT initialize analytics", () => {
            expect(ReactGA.initialize).toBeCalledTimes(0);
          });

          it("should NOT set initialized to true", () => {
            expect(mockSetInitialized).toHaveBeenCalledTimes(0);
          });
        });

        describe("event", () => {
          beforeEach(() => received.result.current.event(Events.General.Test));

          it("should NOT process events", () => {
            expect(ReactGA.event).toBeCalledTimes(0);
          });
        });

        describe("trackButtonClick", () => {
          beforeEach(() => {
            received.result.current.trackButtonClick(
              mockMouseEvent,
              mockButtonName
            );
          });

          it("should NOT process events", () => {
            expect(ReactGA.event).toBeCalledTimes(0);
          });
        });

        describe("trackExternalLinkClick", () => {
          beforeEach(() => {
            received.result.current.trackExternalLinkClick(
              mockMouseEvent,
              mockExternalLink
            );
          });

          it("should NOT process events", () => {
            expect(ReactGA.event).toBeCalledTimes(0);
          });
        });

        describe("trackInternalLinkClick", () => {
          beforeEach(() => {
            received.result.current.trackInternalLinkClick(
              mockMouseEvent,
              mockInternalLink
            );
          });

          it("should NOT process events", () => {
            expect(ReactGA.event).toBeCalledTimes(0);
          });
        });
      });
    });

    describe("with a valid tracker code", () => {
      beforeAll(() => {
        process.env.NEXT_PUBLIC_ANALYTICS_UA_CODE = "tracker code";
      });

      describe("when NOT initialized", () => {
        beforeEach(() => {
          received = arrange({
            initialized: false,
            setInitialized: mockSetInitialized,
          });
        });

        describe("setup", () => {
          beforeEach(async () => {
            act(() => received.result.current.setup());
            await waitFor(() =>
              expect(mockSetInitialized).toHaveBeenCalledTimes(1)
            );
          });

          it("should initialize analytics (with debug disabled)", () => {
            expect(ReactGA.initialize).toBeCalledTimes(1);
            expect(ReactGA.initialize).toHaveBeenCalledWith(
              process.env.NEXT_PUBLIC_ANALYTICS_UA_CODE,
              { debug: expectedDebugMode }
            );
          });

          it("should set initialized to true", () => {
            expect(mockSetInitialized).toHaveBeenCalledWith(true);
          });

          it("should start listening to router events", async () => {
            await waitFor(() =>
              expect(routerEventListener).toHaveBeenCalledTimes(1)
            );
          });

          it("should respond to a router event by publishing the details", () => {
            const fakeUrl = "127.0.0.1/fake";
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

          it("should NOT log events", async () => {
            expect(console.log).toBeCalledTimes(0);
            expect(console.group).toBeCalledTimes(0);
            expect(console.groupEnd).toBeCalledTimes(0);
          });

          it("should NOT process events", async () => {
            expect(ReactGA.event).toBeCalledTimes(0);
          });
        });

        describe("trackButtonClick", () => {
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

        describe("trackExternalLinkClick", () => {
          beforeEach(() => {
            received.result.current.trackExternalLinkClick(
              mockMouseEvent,
              mockExternalLink
            );
          });

          it("should NOT process events", async () => {
            expect(ReactGA.event).toBeCalledTimes(0);
          });
        });

        describe("trackInternalLinkClick", () => {
          beforeEach(() => {
            received.result.current.trackInternalLinkClick(
              mockMouseEvent,
              mockInternalLink
            );
          });

          it("should NOT process events", async () => {
            expect(ReactGA.event).toBeCalledTimes(0);
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

          it("should NOT initialize analytics", () => {
            expect(ReactGA.initialize).toBeCalledTimes(0);
          });

          it("should NOT set initialized to true", () => {
            expect(mockSetInitialized).toHaveBeenCalledTimes(0);
          });
        });

        describe("event", () => {
          beforeEach(() => received.result.current.event(Events.General.Test));

          it("should NOT log events", async () => {
            expect(console.log).toBeCalledTimes(0);
            expect(console.group).toBeCalledTimes(0);
            expect(console.groupEnd).toBeCalledTimes(0);
          });

          it("should process events", async () => {
            expect(ReactGA.event).toBeCalledTimes(1);
            expect(ReactGA.event).toBeCalledWith(Events.General.Test);
          });
        });

        describe("trackButtonClick", () => {
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

        describe("trackExternalLinkClick", () => {
          beforeEach(() => {
            received.result.current.trackExternalLinkClick(
              mockMouseEvent,
              mockExternalLink
            );
          });

          it("should process events as expected", async () => {
            expect(ReactGA.event).toBeCalledTimes(1);
            expect(ReactGA.event).toBeCalledWith(mockExternalLinkClickEvent);
          });
        });

        describe("trackInternalLinkClick", () => {
          beforeEach(() => {
            received.result.current.trackInternalLinkClick(
              mockMouseEvent,
              mockInternalLink
            );
          });

          it("should process events as expected", async () => {
            expect(ReactGA.event).toBeCalledTimes(1);
            expect(ReactGA.event).toBeCalledWith(mockInternalLinkClickEvent);
          });
        });
      });
    });
  });

  describe("when NOT in production and NOT in test", () => {
    beforeAll(() => {
      expectedDebugMode = true;
      (process.env as MutableEnv).NODE_ENV = "development";
    });

    describe("without a valid tracker code", () => {
      beforeAll(() => {
        process.env.NEXT_PUBLIC_ANALYTICS_UA_CODE = "";
      });

      describe("when NOT initialized", () => {
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

          it("should log events", async () => {
            expect(console.log).toBeCalledTimes(1);
            expect(console.log).toBeCalledWith(Events.General.Test);
            expect(console.group).toBeCalledTimes(1);
            expect(console.group).toBeCalledWith("EVENT");
            expect(console.groupEnd).toBeCalledTimes(1);
            expect(console.groupEnd).toBeCalledWith();
          });

          it("should NOT process events", async () => {
            expect(ReactGA.event).toBeCalledTimes(0);
          });
        });

        describe("trackButtonClick", () => {
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

        describe("trackExternalLinkClick", () => {
          beforeEach(() => {
            received.result.current.trackExternalLinkClick(
              mockMouseEvent,
              mockExternalLink
            );
          });

          it("should NOT process events", async () => {
            expect(ReactGA.event).toBeCalledTimes(0);
          });
        });

        describe("trackInternalLinkClick", () => {
          beforeEach(() => {
            received.result.current.trackInternalLinkClick(
              mockMouseEvent,
              mockInternalLink
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
        process.env.NEXT_PUBLIC_ANALYTICS_UA_CODE = "tracker code";
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
        });

        describe("event", () => {
          beforeEach(() => received.result.current.event(Events.General.Test));

          it("should log events", async () => {
            expect(console.log).toBeCalledTimes(1);
            expect(console.log).toBeCalledWith(Events.General.Test);
            expect(console.group).toBeCalledTimes(1);
            expect(console.group).toBeCalledWith("EVENT");
            expect(console.groupEnd).toBeCalledTimes(1);
            expect(console.groupEnd).toBeCalledWith();
          });

          it("should process events", async () => {
            expect(ReactGA.event).toBeCalledTimes(1);
            expect(ReactGA.event).toBeCalledWith(Events.General.Test);
          });
        });
      });

      describe("when NOT initialized", () => {
        beforeEach(() => {
          received = arrange({
            initialized: false,
            setInitialized: mockSetInitialized,
          });
        });

        describe("setup", () => {
          beforeEach(async () => {
            act(() => received.result.current.setup());
            await waitFor(() =>
              expect(mockSetInitialized).toHaveBeenCalledTimes(1)
            );
          });

          it("should initialize analytics (with debug enabled)", async () => {
            expect(ReactGA.initialize).toBeCalledTimes(1);
            expect(ReactGA.initialize).toHaveBeenCalledWith(
              process.env.NEXT_PUBLIC_ANALYTICS_UA_CODE,
              { debug: expectedDebugMode }
            );
          });

          it("should set initialized to true", () => {
            expect(mockSetInitialized).toHaveBeenCalledWith(true);
          });

          it("should start listening to router events", async () => {
            await waitFor(() =>
              expect(routerEventListener).toHaveBeenCalledTimes(1)
            );
          });

          it("should respond to a router event by publishing the details", async () => {
            const fakeUrl = "127.0.0.1/fake";
            const handler = routerEventListener.mock.calls[0][1];

            handler(fakeUrl);

            expect(ReactGA.set).toBeCalledTimes(1);
            expect(ReactGA.set).toBeCalledWith({ page: fakeUrl });

            expect(ReactGA.pageview).toBeCalledTimes(1);
            expect(ReactGA.pageview).toBeCalledWith(fakeUrl);
          });
        });
      });
    });
  });
});
