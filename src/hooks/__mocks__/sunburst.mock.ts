import nullNode from "@src/providers/user/reports/sunburst.node.initial";

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
