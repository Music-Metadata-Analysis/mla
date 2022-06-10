const mockNavBarHook = {
  getters: {
    isHamburgerEnabled: true,
    isVisible: true,
  },
  setters: {
    enableHamburger: jest.fn(),
    disableHamburger: jest.fn(),
    hideNavBar: jest.fn(),
    showNavBar: jest.fn(),
  },
};

export default mockNavBarHook;
