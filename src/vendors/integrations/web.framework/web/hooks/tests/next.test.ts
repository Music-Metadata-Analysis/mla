import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import { useRouter } from "next/router";
import useNextRouter from "../next";
import { mockUseRouter } from "@src/vendors/integrations/web.framework/__mocks__/vendor.mock";

jest.mock("next/router", () => ({
  useRouter: jest.fn(() => mockNextRouter),
}));

const mockPath = "/mockPath.com";
const mockNextRouter = {
  back: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
  },
  pathname: mockPath,
  push: jest.fn(),
  reload: jest.fn(),
};

describe("useNextRouter", () => {
  let received: ReturnType<typeof arrange>;
  const mockCallBack = jest.fn();
  const mockAlternatePath = "/mock/alternate/path";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return renderHook(() => useNextRouter());
  };

  const checkHookRender = () => {
    it("should render the NextJS useRouter hook during render", () => {
      expect(useRouter).toBeCalledTimes(1);
      expect(useRouter).toBeCalledWith();
    });
  };

  const checkHookProperties = () => {
    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(
        mockUseRouter as unknown as Record<string, unknown>
      ).sort();
      const hookKeys = dk(
        received.result.current as unknown as Record<string, unknown>
      ).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should contain the correct functions", () => {
      expect(received.result.current.push).toBeInstanceOf(Function);
      expect(received.result.current.reload).toBeInstanceOf(Function);
      expect(
        received.result.current.handlers.addRouteChangeHandler
      ).toBeInstanceOf(Function);
      expect(
        received.result.current.handlers.removeRouteChangeHandler
      ).toBeInstanceOf(Function);
    });

    it("should contain the correct string values", () => {
      expect(received.result.current.path).toBe(mockNextRouter.pathname);
    });
  };

  describe("when rendered and the framework router returns normally", () => {
    beforeEach(() => {
      received = arrange();
    });

    checkHookRender();
    checkHookProperties();

    describe("back", () => {
      describe("when called", () => {
        beforeEach(() => {
          received.result.current.back();
        });

        it("should call the underlying NextJS router method correctly", () => {
          expect(mockNextRouter.back).toBeCalledTimes(1);
          expect(mockNextRouter.back).toBeCalledWith();
        });
      });
    });

    describe("addRouteChangeHandler", () => {
      describe("when called with a valid callback", () => {
        beforeEach(() => {
          received.result.current.handlers.addRouteChangeHandler(mockCallBack);
        });

        it("should call the underlying NextJS router method correctly", () => {
          expect(mockNextRouter.events.on).toBeCalledTimes(1);
          expect(mockNextRouter.events.on).toBeCalledWith(
            "routeChangeStart",
            mockCallBack
          );
        });
      });
    });

    describe("removeRouteChangeHandler", () => {
      describe("when called with a valid callback", () => {
        beforeEach(() => {
          received.result.current.handlers.removeRouteChangeHandler(
            mockCallBack
          );
        });

        it("should call the underlying NextJS router method correctly", () => {
          expect(mockNextRouter.events.off).toBeCalledTimes(1);
          expect(mockNextRouter.events.off).toBeCalledWith(
            "routeChangeStart",
            mockCallBack
          );
        });
      });
    });

    describe("push", () => {
      describe("when called with a valid path", () => {
        beforeEach(() => {
          received.result.current.push(mockAlternatePath);
        });

        it("should call the underlying NextJS router method correctly", () => {
          expect(mockNextRouter.push).toBeCalledTimes(1);
          expect(mockNextRouter.push).toBeCalledWith(mockAlternatePath);
        });
      });
    });

    describe("reload", () => {
      describe("when called", () => {
        beforeEach(() => {
          received.result.current.reload();
        });

        it("should call the underlying NextJS router method correctly", () => {
          expect(mockNextRouter.reload).toBeCalledTimes(1);
          expect(mockNextRouter.reload).toBeCalledWith();
        });
      });
    });
  });

  describe("when rendered and the framework router returns a null object", () => {
    beforeEach(() => {
      (useRouter as jest.Mock).mockReturnValueOnce(
        null as unknown as typeof mockUseRouter
      );

      received = arrange();
    });

    it("the router path should fallback to an empty string", () => {
      expect(received.result.current.path).toBe("");
    });
  });
});
