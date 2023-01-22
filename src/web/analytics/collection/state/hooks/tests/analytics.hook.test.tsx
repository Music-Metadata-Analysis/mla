import { act, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import React from "react";
import mockHookValues from "../__mocks__/analytics.hook.mock";
import useAnalytics from "../analytics.hook";
import {
  mockGoogleAnalytics,
  MockEventDefinition,
} from "@src/vendors/integrations/analytics/__mocks__/vendor.mock";
import Events from "@src/web/analytics/collection/events/definitions";
import { AnalyticsContext } from "@src/web/analytics/collection/state/providers/analytics.provider";
import mockRouterHook from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";
import type { MutableEnv } from "@src/utilities/types/process.types";
import type { AnalyticsContextInterface } from "@src/web/analytics/collection/types/state/provider.types";
import type { MouseEvent, ReactNode } from "react";

jest.mock("@src/web/navigation/routing/hooks/router.hook");

jest.mock("@src/vendors/integrations/analytics/vendor");

interface MockAnalyticsContextWithChildren {
  children?: ReactNode;
  mockContext: AnalyticsContextInterface;
}

describe("useAnalytics", () => {
  let originalEnvironment: typeof process.env;
  let received: ReturnType<typeof arrange>;

  const mockButtonName = "MockButtonName";
  const mockButtonClickEvent = new MockEventDefinition({
    action: `CLICKED: ${mockButtonName}`,
    category: "MAIN",
    label: "BUTTON",
  });
  const mockExternalLink = "http://somewebsite.com";
  const mockExternalLinkClickEvent = new MockEventDefinition({
    action: `VISITED: ${mockExternalLink}`,
    category: "MAIN",
    label: "EXTERNAL_LINK",
  });
  const mockInternalLink = "http://somewebsite.com";
  const mockInternalLinkClickEvent = new MockEventDefinition({
    action: `VISITED: ${mockInternalLink}`,
    category: "MAIN",
    label: "INTERNAL_LINK",
  });

  const mockMouseEvent = {
    currentTarget: {},
  } as MouseEvent<HTMLInputElement>;

  const mockSetInitialized = jest.fn();

  beforeAll(() => {
    originalEnvironment = process.env;
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "group").mockImplementation(() => jest.fn());
    jest.spyOn(console, "groupEnd").mockImplementation(() => jest.fn());
    jest.spyOn(console, "log").mockImplementation(() => jest.fn());
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

  const testDoesNotInitialize = () => {
    describe("setup", () => {
      beforeEach(() => received.result.current.setup());

      it("should NOT initialize analytics", () => {
        expect(mockGoogleAnalytics.initialize).toBeCalledTimes(0);
      });

      it("should NOT set initialized to true", () => {
        expect(mockSetInitialized).toHaveBeenCalledTimes(0);
      });
    });
  };

  const testDoesNotTrack = () => {
    describe("event", () => {
      beforeEach(() => received.result.current.event(Events.General.Test));

      it("should NOT process events", () => {
        expect(mockGoogleAnalytics.event).toBeCalledTimes(0);
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
        expect(mockGoogleAnalytics.event).toBeCalledTimes(0);
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
        expect(mockGoogleAnalytics.event).toBeCalledTimes(0);
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
        expect(mockGoogleAnalytics.event).toBeCalledTimes(0);
      });
    });
  };

  const testHandlesEventsWithLogging = () => {
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
        expect(mockGoogleAnalytics.event).toBeCalledTimes(1);
        expect(mockGoogleAnalytics.event).toBeCalledWith(Events.General.Test);
      });
    });
  };

  const testHandlesEventsWithOutLogging = () => {
    describe("event", () => {
      beforeEach(() => received.result.current.event(Events.General.Test));

      it("should NOT log events", async () => {
        expect(console.log).toBeCalledTimes(0);
        expect(console.group).toBeCalledTimes(0);
        expect(console.groupEnd).toBeCalledTimes(0);
      });

      it("should process events", async () => {
        expect(mockGoogleAnalytics.event).toBeCalledTimes(1);
        expect(mockGoogleAnalytics.event).toBeCalledWith(Events.General.Test);
      });
    });
  };

  const testInitializes = () => {
    describe("setup", () => {
      beforeEach(async () => {
        act(() => received.result.current.setup());
        await waitFor(() =>
          expect(mockSetInitialized).toHaveBeenCalledTimes(1)
        );
      });

      it("should initialize analytics (with debug disabled)", () => {
        expect(mockGoogleAnalytics.initialize).toBeCalledTimes(1);
        expect(mockGoogleAnalytics.initialize).toHaveBeenCalledWith(
          process.env.NEXT_PUBLIC_ANALYTICS_UA_CODE
        );
      });

      it("should set initialized to true", () => {
        expect(mockSetInitialized).toHaveBeenCalledWith(true);
      });

      it("should start listening to router events", async () => {
        await waitFor(() =>
          expect(
            mockRouterHook.handlers.addRouteChangeHandler
          ).toHaveBeenCalledTimes(1)
        );
      });

      it("should respond to a router event by publishing the details", () => {
        const fakeUrl = "127.0.0.1/fake";
        const handler = jest.mocked(
          mockRouterHook.handlers.addRouteChangeHandler
        ).mock.calls[0][0];

        handler(fakeUrl);

        expect(mockGoogleAnalytics.routeChange).toBeCalledTimes(1);
        expect(mockGoogleAnalytics.routeChange).toBeCalledWith(fakeUrl);
      });

      testUnmount();
    });
  };

  const testTracks = () => {
    describe("trackButtonClick", () => {
      beforeEach(() => {
        received.result.current.trackButtonClick(
          mockMouseEvent,
          mockButtonName
        );
      });

      it("should process events as expected", async () => {
        expect(mockGoogleAnalytics.event).toBeCalledTimes(1);
        expect(mockGoogleAnalytics.event).toBeCalledWith(mockButtonClickEvent);
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
        expect(mockGoogleAnalytics.event).toBeCalledTimes(1);
        expect(mockGoogleAnalytics.event).toBeCalledWith(
          mockExternalLinkClickEvent
        );
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
        expect(mockGoogleAnalytics.event).toBeCalledTimes(1);
        expect(mockGoogleAnalytics.event).toBeCalledWith(
          mockInternalLinkClickEvent
        );
      });
    });
  };

  const testUnmount = () => {
    describe("when unmounted", () => {
      let handler: (url: string) => void;

      beforeEach(async () => {
        received.unmount();
        handler = jest.mocked(mockRouterHook.handlers.addRouteChangeHandler)
          .mock.calls[0][0];
      });

      it("should clean up the the route change listener", async () => {
        await waitFor(() =>
          expect(
            mockRouterHook.handlers.removeRouteChangeHandler
          ).toHaveBeenCalledTimes(1)
        );
        await waitFor(() =>
          expect(
            mockRouterHook.handlers.removeRouteChangeHandler
          ).toHaveBeenCalledWith(handler)
        );
      });
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
      const mockObjectKeys = dk(mockHookValues).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });
  });

  describe("when in production", () => {
    beforeAll(() => {
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

        testDoesNotInitialize();
        testDoesNotTrack();
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

        testInitializes();
        testDoesNotTrack();
      });

      describe("when analytics is initialized", () => {
        beforeEach(() => {
          received = arrange({
            initialized: true,
            setInitialized: mockSetInitialized,
          });
        });

        testDoesNotInitialize();
        testHandlesEventsWithOutLogging();
        testTracks();
      });
    });
  });

  describe("when NOT in production and NOT in test", () => {
    beforeAll(() => {
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

        testDoesNotInitialize();
        testDoesNotTrack();
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

        testDoesNotInitialize();
        testHandlesEventsWithLogging();
        testTracks();
      });

      describe("when NOT initialized", () => {
        beforeEach(() => {
          received = arrange({
            initialized: false,
            setInitialized: mockSetInitialized,
          });
        });

        testInitializes();
        testDoesNotTrack();
      });
    });
  });
});
