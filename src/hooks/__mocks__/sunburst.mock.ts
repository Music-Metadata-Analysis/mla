import nullNode from "@src/providers/user/reports/sunburst.node.initial";

const mockValues = {
  setters: {
    setSelectedNode: jest.fn(),
    setSvgTransition: jest.fn(),
  },
  getters: {
    selectedNode: nullNode,
    svgTransition: false,
  },
};

export default mockValues;
