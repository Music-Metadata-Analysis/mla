import { act, renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockUseSunBurstState from "./sunburst.mock.hook";
import nullNode from "../../providers/user/reports/sunburst.node.initial";
import useSunBurstState from "../sunburst";
import type { d3Node } from "../../types/reports/sunburst.types";

describe("mockUseSunBurstState", () => {
  let received: ReturnType<typeof arrange>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return renderHook(() => useSunBurstState());
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange();
    });

    it("should contain the correct setter functions", () => {
      expect(received.result.current.setters.setSelectedNode).toBeInstanceOf(
        Function
      );
      expect(received.result.current.setters.setSvgTransition).toBeInstanceOf(
        Function
      );
    });

    it("should contain the correct getters with sane defaults", () => {
      expect(received.result.current.getters.selectedNode).toBe(nullNode);
      expect(received.result.current.getters.svgTransition).toBe(false);
    });

    describe("setSelectedNode", () => {
      const mockNode = { data: { name: "mockNode" } } as d3Node;

      beforeEach(() => {
        act(() => received.result.current.setters.setSelectedNode(mockNode));
      });

      it("should update the correct getter", () => {
        expect(received.result.current.getters.selectedNode).toBe(mockNode);
      });
    });

    describe("setSvgTransition", () => {
      beforeEach(() => {
        act(() => received.result.current.setters.setSvgTransition(true));
      });

      it("should update the correct getter", () => {
        expect(received.result.current.getters.svgTransition).toBe(true);
      });
    });

    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(mockUseSunBurstState).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });
  });
});
