const mockValues = {
  canFitOnScreen: true,
  flexProps: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
  },
  ref: {
    info: { current: null, value: 1 },
    chart: { current: null, value: 2 },
  },
  update: jest.fn(),
};

export default mockValues;
