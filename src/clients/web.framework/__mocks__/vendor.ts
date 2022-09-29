import { mockImageShim, mockIsBuildTime, mockUseRouter } from "./vendor.mock";
import type { WebFrameworkVendor } from "@src/types/clients/web.framework/vendor.types";

const webFrameworkVendor: WebFrameworkVendor = {
  ImageShim: mockImageShim,
  isBuildTime: mockIsBuildTime,
  routerHook: jest.fn(() => mockUseRouter),
};

export default webFrameworkVendor;
