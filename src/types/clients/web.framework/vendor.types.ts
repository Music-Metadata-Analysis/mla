export interface VendorRouterHookInterface {
  back: () => void;
  path: string;
  push(url: string): void;
  reload(): void;
  handlers: RouterHandlers;
}

export interface RouterHandlers {
  addRouteChangeHandler(cb: (url: string) => void): void;
  removeRouteChangeHandler(cb: (url: string) => void): void;
}

export interface VendorImageProps {
  alt: string;
  height: number;
  src: string;
  width: number;
}

export interface WebFrameworkVendor {
  ImageShim: (props: VendorImageProps) => JSX.Element;
  isBuildTime: () => boolean;
  routerHook: () => VendorRouterHookInterface;
}