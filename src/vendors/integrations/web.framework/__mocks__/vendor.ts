import {
  mockHeadShim,
  mockImageShim,
  mockIsBuildTime,
  mockIsSSR,
  mockUseRouter,
} from "./vendor.mock";
import type { WebFrameworkVendorInterface } from "@src/vendors/types/integrations/web.framework/vendor.types";

export const webFrameworkVendor: WebFrameworkVendorInterface = {
  HeadShim: mockHeadShim,
  ImageShim: mockImageShim,
  isBuildTime: mockIsBuildTime,
  isSSR: mockIsSSR,
  routerHook: jest.fn(() => mockUseRouter),
};
