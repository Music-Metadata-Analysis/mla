import {
  mockHeadShim,
  mockImageShim,
  mockIsBuildTime,
  mockIsSSR,
  mockUseRouter,
} from "./vendor.mock";
import type { WebFrameworkVendor } from "@src/types/clients/web.framework/vendor.types";

const webFrameworkVendor: WebFrameworkVendor = {
  HeadShim: mockHeadShim,
  ImageShim: mockImageShim,
  isBuildTime: mockIsBuildTime,
  isSSR: mockIsSSR,
  routerHook: jest.fn(() => mockUseRouter),
};

export default webFrameworkVendor;
