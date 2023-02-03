import nullNode from "@src/web/reports/generics/state/charts/sunburst/null.node";

const mockValues = {
  drawer: {
    setFalse: jest.fn(),
    setTrue: jest.fn(),
    state: false,
  },
  node: {
    selected: nullNode,
    setSelected: jest.fn(),
  },
  svg: {
    isTransitioning: false,
    setTransitioning: jest.fn(),
  },
};

export default mockValues;
