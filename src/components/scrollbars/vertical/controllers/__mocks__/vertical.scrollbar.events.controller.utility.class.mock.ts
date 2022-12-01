const mockVerticalScrollBarEventHandlers = {
  activeScrollBar: jest.fn(),
  mouseDownHandler: jest.fn(),
  registerHookHandlers: jest.fn(),
  unregisterAllHandlers: jest.fn(),
};

export const activeScrollBarSetter = jest.fn();

Object.defineProperty(mockVerticalScrollBarEventHandlers, "activeScrollBar", {
  set: activeScrollBarSetter,
});

export default mockVerticalScrollBarEventHandlers;
