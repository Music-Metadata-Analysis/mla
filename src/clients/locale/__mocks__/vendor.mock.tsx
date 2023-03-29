import type {
  LocaleVendorInterface,
  LocaleVendorHookInterface,
} from "@src/types/clients/locale/vendor.types";
import type { WebFrameworkVendorAppComponentProps } from "@src/types/clients/web.framework/vendor.types";

export const mockLocaleVendorHOCIdentifier = "mockLocaleVendorHOCIdentifier";

export const mockLocaleVendorHOC = jest.fn(
  (Component: React.FC<WebFrameworkVendorAppComponentProps<any>>) =>
    jest.fn((props) => {
      return (
        <div data-testid={"mockLocaleVendorHOCIdentifier"}>
          <Component {...props} />
        </div>
      );
    })
) as LocaleVendorInterface["HOC"];

export const mockLocaleVendorHook: Record<
  keyof LocaleVendorHookInterface,
  jest.Mock
> = {
  t: jest.fn(),
};
