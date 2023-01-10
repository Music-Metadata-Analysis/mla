import { mockLocaleVendorHook } from "@src/vendors/integrations/locale/__mocks__/vendor.mock";
import type {
  LocaleVendorHookInterface,
  tContentType,
} from "@src/vendors/types/integrations/locale/vendor.types";

const mockValues = mockLocaleVendorHook;

export const mockLocales: Record<string, MockUseLocale> = {};

export const _t = (value: string) => `t(${value})`;

export class MockUseLocale implements LocaleVendorHookInterface {
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

export const checkTProp = (params: {
  name: string;
  component: (props: never) => JSX.Element;
  namespace: string;
  arg?: number;
  call?: number;
  propName?: string;
}) => {
  const arg = params.arg ? params.arg : 0;
  const call = params.call ? params.call : 0;
  const propName = params.propName ? params.propName : "t";

  it(`should call ${params.name} with a translation function for the namespace: ${params.namespace}`, () => {
    const tProp = jest.mocked(params.component).mock.calls[arg][call][propName];
    expect(tProp).toBe(mockLocales[params.namespace].t);
  });
};

export default mockValues;
