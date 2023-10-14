import type {
  LocaleVendorInterface,
  LocaleVendorHookInterface,
  tContentType,
} from "@src/vendors/types/integrations/locale/vendor.types";
import type { WebFrameworkVendorAppComponentProps } from "@src/vendors/types/integrations/web.framework/vendor.types";

export const mockLocaleVendorHOCIdentifier = "mockLocaleVendorHOCIdentifier";

export const _t = (value: string) => `t(${value})`;

export const mockLocaleVendorHOC = jest.fn(
  (
    Component: React.FC<
      WebFrameworkVendorAppComponentProps<Record<string, unknown>>
    >
  ) =>
    jest.fn((props) => {
      return (
        <div data-testid={"mockLocaleVendorHOCIdentifier"}>
          <Component {...props} />
        </div>
      );
    })
) as LocaleVendorInterface["HOC"];

export class MockLocaleVendorUseTranslation
  implements LocaleVendorHookInterface
{
  namespace: string;
  protected json: tContentType;

  constructor(namespace: string) {
    this.namespace = namespace;
    this.json = require(`@locales/${namespace}.json`);
  }

  t = jest.fn((key: string) => {
    const translation = this.recursiveKeyLookup(key, this.json) as string;
    return _t(translation);
  });

  protected recursiveKeyLookup = (
    translationDotKey: string,
    content: tContentType
  ): string | tContentType => {
    const splitKeys = translationDotKey.split(".");
    if (splitKeys.length === 1) return content[translationDotKey];
    const firstKey = splitKeys.shift() as string;
    return this.recursiveKeyLookup(
      splitKeys.join("."),
      content[firstKey] as tContentType
    );
  };
}

export const mockLocaleVendorHook: Record<
  keyof LocaleVendorHookInterface,
  jest.Mock
> = {
  t: jest.fn(),
};
