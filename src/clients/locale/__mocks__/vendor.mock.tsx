import type { VendorAppComponentProps } from "@src/clients/web.framework/vendor.types";
import type {
  LocaleVendor,
  LocaleVendorHookInterface,
} from "@src/types/clients/locale/vendor.types";

export const mockLocaleVendorHOCIdentifier = "mockLocaleVendorHOCIdentifier";

export const mockLocaleVendorHOC = jest.fn(
  (Component: React.FC<VendorAppComponentProps>) =>
    jest.fn((props) => {
      return (
        <div data-testid={"mockLocaleVendorHOCIdentifier"}>
          <Component {...props} />
        </div>
      );
    })
) as LocaleVendor["HOC"];

export const mockLocaleVendorHook: Record<
  keyof LocaleVendorHookInterface,
  jest.Mock
> = {
  t: jest.fn(),
};
