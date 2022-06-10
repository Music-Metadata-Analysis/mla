import nullNode from "../../providers/user/reports/sunburst.node.initial";

const mockUseSunBurstState = {
  setters: {
    setSelectedNode: jest.fn(),
    setSvgTransition: jest.fn(),
  },
  getters: {
    selectedNode: nullNode,
    svgTransition: false,
  },
};

export default mockUseSunBurstState;
