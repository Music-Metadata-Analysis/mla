import type {
  LocaleVendor,
  LocaleVendorHookInterface,
} from "@src/types/clients/locale/vendor.types";
import type { AppProps } from "next/app";

export const mockLocaleVendorHOCIdentifier = "mockLocaleVendorHOCIdentifier";

export const mockLocaleVendorHOC = jest.fn((Component: React.FC<AppProps>) =>
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
