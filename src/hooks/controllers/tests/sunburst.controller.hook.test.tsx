import { act, renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import useSunBurstController from "../sunburst.controller.hook";
import mockNavBarControllerHook from "@src/hooks/controllers/__mocks__/navbar.controller.hook.mock";
import mockHookValues from "@src/hooks/controllers/__mocks__/sunburst.controller.hook.mock";
import nullNode from "@src/providers/user/reports/sunburst.node.initial";
import type { d3Node } from "@src/types/reports/generics/sunburst.types";

jest.mock("@src/hooks/controllers/navbar.controller.hook");

describe("useSunBurstController", () => {
  let received: ReturnType<typeof arrange>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return renderHook(() => useSunBurstController());
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange();
    });

    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(mockHookValues).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should contain the correct drawer functions", () => {
      expect(received.result.current.drawer.setFalse).toBeInstanceOf(Function);
      expect(received.result.current.drawer.setTrue).toBeInstanceOf(Function);
    });

    it("should contain the correct drawer defaults", () => {
      expect(received.result.current.drawer.state).toBe(false);
    });

    it("should contain the correct node functions", () => {
      expect(received.result.current.node.setSelected).toBeInstanceOf(Function);
    });

    it("should contain the correct node defaults", () => {
      expect(received.result.current.node.selected).toBe(nullNode);
    });

    it("should contain the correct svg functions", () => {
      expect(received.result.current.svg.setTransitioning).toBeInstanceOf(
        Function
      );
    });

    it("should contain the correct svg defaults", () => {
      expect(received.result.current.svg.isTransitioning).toBe(false);
    });

    describe("drawer.openDrawer", () => {
      beforeEach(() => {
        act(() => received.result.current.drawer.setTrue());
      });

      it("should update the drawer's state correctly", () => {
        expect(received.result.current.drawer.state).toBe(true);
      });

      it("should disable the navbar's mobile menu", () => {
        expect(mockNavBarControllerHook.hamburger.setFalse).toBeCalledTimes(1);
        expect(mockNavBarControllerHook.hamburger.setFalse).toBeCalledWith();
      });
    });

    describe("drawer.closeDrawer", () => {
      beforeEach(() => {
        act(() => received.result.current.drawer.setFalse());
      });

      it("should update the drawer's state correctly", () => {
        expect(received.result.current.drawer.state).toBe(false);
      });

      it("should enable the navbar's mobile menu", () => {
        expect(mockNavBarControllerHook.hamburger.setTrue).toBeCalledTimes(1);
        expect(mockNavBarControllerHook.hamburger.setTrue).toBeCalledWith();
      });
    });

    describe("node.setSelected", () => {
      const mockNode = { data: { name: "mockNode" } } as d3Node;

      beforeEach(() => {
        act(() => received.result.current.node.setSelected(mockNode));
      });

      it("should update the selected node correctly", () => {
        expect(received.result.current.node.selected).toBe(mockNode);
      });

      it("should start an svg transition", () => {
        expect(received.result.current.svg.isTransitioning).toBe(true);
      });
    });

    describe("svg.setTransitioning", () => {
      beforeEach(() => {
        act(() => received.result.current.svg.setTransitioning(true));
      });

      it("should update the svg's isTransitioning property", () => {
        expect(received.result.current.svg.isTransitioning).toBe(true);
      });
    });
  });
});
