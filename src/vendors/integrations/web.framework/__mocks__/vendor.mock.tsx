import type { WebFrameworkVendorRouterHookInterface } from "@src/vendors/types/integrations/web.framework/vendor.types";

export const mockHeadShim = jest.fn(({ children }: { children?: unknown }) => {
  return <>{children}</>;
});

export const mockImageShim = jest.fn((props) => {
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...props} />;
});

export const mockIsBuildTime = jest.fn();
export const mockIsSSR = jest.fn();

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
  keyof Omit<WebFrameworkVendorRouterHookInterface, "path" | "handlers">,
  jest.Mock
> & {
  path: string;
  handlers: Record<
    keyof WebFrameworkVendorRouterHookInterface["handlers"],
    jest.Mock
  >;
};

export const mockApplyMiddleware = jest.fn((props) => props);
export const mockLoggingMiddleware = jest.fn();
