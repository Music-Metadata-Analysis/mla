const mockUseSunBurstState = {
  setters: {
    setCurrentLayout: jest.fn(),
    setFitsOnScreen: jest.fn(),
  },
  getters: {
    currentLayout: "normal",
    fitsOnScreen: true,
  },
  sections: {
    info: { current: "info" },
    chart: { current: "chart" },
  },
};

export default mockUseSunBurstState;
