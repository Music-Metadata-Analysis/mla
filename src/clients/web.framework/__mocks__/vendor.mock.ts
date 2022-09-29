import type { VendorRouterHookInterface } from "@src/types/clients/web.framework/vendor.types";

export const mockImageShim = jest.fn();
export const mockIsBuildTime = jest.fn();

export const mockUseRouter = {
  back: jest.fn(),
  handlers: {
    addRouteChangeHandler: jest.fn(),
    removeRouteChangeHandler: jest.fn(),
  },
  path: "/somewhere/on/the/web",
  push: jest.fn(),
  reload: jest.fn(),
} as Record<
  keyof Omit<VendorRouterHookInterface, "path" | "handlers">,
  jest.Mock
> & {
  path: string;
  handlers: Record<keyof VendorRouterHookInterface["handlers"], jest.Mock>;
};
