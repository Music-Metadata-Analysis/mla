import { waitFor } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/toggle.hook.mock";
import useToggle from "../toggle.hook";

describe("useToggle", () => {
  let received: ReturnType<typeof arrange>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = (initialState: boolean | undefined) => {
    return renderHook(() => useToggle(initialState));
  };

  const checkOff = () => {
    describe("setFalse", () => {
      beforeEach(async () => {
        await act(async () => received.result.current.setFalse());
      });

      it("should set state to false", () => {
        expect(received.result.current.state).toBe(false);
      });
    });
  };

  const checkOn = () => {
    describe("setTrue", () => {
      beforeEach(async () => {
        await act(async () => received.result.current.setTrue());
      });

      it("should set state to true", async () => {
        await waitFor(() => expect(received.result.current.state).toBe(true));
      });
    });
  };

  const checkToggle = () => {
    describe("toggle", () => {
      let oldState: boolean;

      beforeEach(async () => {
        oldState = received.result.current.state;
        await act(async () => {
          received.result.current.toggle();
        });
      });

      it(`should toggle the state value`, async () => {
        await waitFor(() =>
          expect(received.result.current.state).not.toBe(oldState)
        );
      });
    });
  };

  const checkProperties = () => {
    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(mockHookValues).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should contain the correct functions", () => {
      expect(typeof received.result.current.setFalse).toBe("function");
      expect(typeof received.result.current.setTrue).toBe("function");
      expect(typeof received.result.current.toggle).toBe("function");
    });
  };

  describe("when rendered with the default initial value", () => {
    beforeEach(() => {
      received = arrange(undefined);
    });

    checkProperties();

    it("should contain the correct state boolean", () => {
      expect(received.result.current.state).toBe(false);
    });

    checkOff();
    checkOn();
    checkToggle();
  });

  describe("when rendered with a 'true' initial value", () => {
    beforeEach(() => {
      received = arrange(true);
    });

    checkProperties();

    it("should contain the correct state boolean", () => {
      expect(received.result.current.state).toBe(true);
    });

    checkOff();
    checkOn();
    checkToggle();
  });
});
