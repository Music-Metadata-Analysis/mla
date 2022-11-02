import { waitFor } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/flip.card.controller.hook.mock";
import useFlipCardController from "../flip.card.controller.hook";

describe("useFlipCardController", () => {
  let received: ReturnType<typeof arrange>;

  const mockCardIndex = 100;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return renderHook(() => useFlipCardController());
  };

  const defaultScenario = () => {
    received = arrange();
  };

  const nonDefaultScenario = async () => {
    received = arrange();

    await act(async () => received.result.current.card.flip(mockCardIndex));

    await waitFor(() =>
      expect(received.result.current.card.state).toBe(mockCardIndex)
    );

    await waitFor(() =>
      expect(received.result.current.drawer.state).toBe(true)
    );
  };

  const checkHookProperties = () => {
    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(mockHookValues).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should contain the correct card functions", () => {
      expect(typeof received.result.current.card.flip).toBe("function");
    });

    it("should contain the correct drawer functions", () => {
      expect(typeof received.result.current.drawer.setFalse).toBe("function");
    });
  };

  describe("with the default state (no flipped card)", () => {
    beforeEach(() => defaultScenario());

    checkHookProperties();

    describe("drawer.setFalse", () => {
      beforeEach(async () => {
        await act(async () => received.result.current.drawer.setFalse());
      });

      it("should set the card.state to null", async () => {
        await waitFor(() =>
          expect(received.result.current.card.state).toBeNull()
        );
      });

      it("should set drawer.state to false", async () => {
        await waitFor(() =>
          expect(received.result.current.drawer.state).toBe(false)
        );
      });
    });

    describe("card.flip", () => {
      beforeEach(async () => {
        await act(async () => received.result.current.card.flip(mockCardIndex));
      });

      it("should set card.state to the expected index value", async () => {
        await waitFor(() =>
          expect(received.result.current.card.state).toBe(mockCardIndex)
        );
      });

      it("should set drawer.state to true", async () => {
        await waitFor(() =>
          expect(received.result.current.drawer.state).toBe(true)
        );
      });
    });
  });

  describe("with a non-default state (flipped card)", () => {
    beforeEach(async () => await nonDefaultScenario());

    checkHookProperties();

    describe("drawer.setFalse", () => {
      beforeEach(async () => {
        await act(async () => received.result.current.drawer.setFalse());
      });

      it("should set the flipped card to null", async () => {
        await waitFor(() =>
          expect(received.result.current.card.state).toBeNull()
        );
      });

      it("should set state to false", async () => {
        await waitFor(() =>
          expect(received.result.current.drawer.state).toBe(false)
        );
      });
    });

    describe("card.flip", () => {
      beforeEach(async () => {
        await act(async () =>
          received.result.current.card.flip(mockCardIndex + 1)
        );
      });

      it("should set card.state to the expected index value", async () => {
        await waitFor(() =>
          expect(received.result.current.card.state).toBe(mockCardIndex + 1)
        );
      });

      it("should set drawer.state to true", async () => {
        await waitFor(() =>
          expect(received.result.current.drawer.state).toBe(true)
        );
      });
    });
  });
});
