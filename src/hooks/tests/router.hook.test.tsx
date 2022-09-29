import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/router.mock";
import useRouter from "../router";

jest.mock("@src/clients/web.framework/vendor");

describe("useRouter", () => {
  let received: ReturnType<typeof arrange>;
  const mockCallBack = jest.fn();
  const mockAlternatePath = "/mock/alternate/path";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return renderHook(() => useRouter());
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange();
    });

    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(
        mockHookValues as unknown as Record<string, unknown>
      ).sort();
      const hookKeys = dk(
        received.result.current as unknown as Record<string, unknown>
      ).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should contain the correct functions", () => {
      expect(typeof received.result.current.push).toBe("function");
      expect(typeof received.result.current.reload).toBe("function");
      expect(
        typeof received.result.current.handlers.addRouteChangeHandler
      ).toBe("function");
      expect(
        typeof received.result.current.handlers.removeRouteChangeHandler
      ).toBe("function");
    });
  });

  describe("back", () => {
    describe("when called", () => {
      beforeEach(() => {
        received.result.current.back();
      });

      it("should call the underlying vendor hook's router method correctly", () => {
        expect(mockHookValues.back).toBeCalledTimes(1);
        expect(mockHookValues.back).toBeCalledWith();
      });
    });
  });

  describe("addRouteChangeHandler", () => {
    describe("when called with a valid callback", () => {
      beforeEach(() => {
        received.result.current.handlers.addRouteChangeHandler(mockCallBack);
      });

      it("should call the underlying vendor hook's router method correctly", () => {
        expect(mockHookValues.handlers.addRouteChangeHandler).toBeCalledTimes(
          1
        );
        expect(mockHookValues.handlers.addRouteChangeHandler).toBeCalledWith(
          mockCallBack
        );
      });
    });
  });

  describe("removeRouteChangeHandler", () => {
    describe("when called with a valid callback", () => {
      beforeEach(() => {
        received.result.current.handlers.removeRouteChangeHandler(mockCallBack);
      });

      it("should call the underlying vendor hook's router method correctly", () => {
        expect(
          mockHookValues.handlers.removeRouteChangeHandler
        ).toBeCalledTimes(1);
        expect(mockHookValues.handlers.removeRouteChangeHandler).toBeCalledWith(
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

      it("should call the underlying vendor hook's router method correctly", () => {
        expect(mockHookValues.push).toBeCalledTimes(1);
        expect(mockHookValues.push).toBeCalledWith(mockAlternatePath);
      });
    });
  });

  describe("reload", () => {
    describe("when called", () => {
      beforeEach(() => {
        received.result.current.reload();
      });

      it("should call the underlying vendor hook's router method correctly", () => {
        expect(mockHookValues.reload).toBeCalledTimes(1);
        expect(mockHookValues.reload).toBeCalledWith();
      });
    });
  });
});
