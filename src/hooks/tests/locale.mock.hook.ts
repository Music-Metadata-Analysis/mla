import type { LocaleVendorHookInterface } from "@src/types/clients/locale/vendor.types";
import type { translationStringType } from "@src/types/clients/locale/vendor.types";

const mockLocaleHook: LocaleVendorHookInterface = {
  t: jest.fn(),
};

export class mockUseLocale implements LocaleVendorHookInterface {
  namespace: string;
  protected json: translationStringType;

  constructor(namespace: string) {
    this.namespace = namespace;
    this.json = require(`@locales/${namespace}.json`);
  }

  t = (key: string) => {
    const translation = this.recursiveKeyLookup(key, this.json) as string;
    return _t(translation);
  };

  protected recursiveKeyLookup = (
    translationDotKey: string,
    content: translationStringType
  ): string | translationStringType => {
    const splitKeys = translationDotKey.split(".");
    if (splitKeys.length === 1) return content[translationDotKey];
    const firstKey = splitKeys.shift() as string;
    return this.recursiveKeyLookup(
      splitKeys.join("."),
      content[firstKey] as translationStringType
    );
  };
}

export class mockTProp {
  namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }
}

export const checkTProp = ({
  name,
  component,
  namespace,
  arg,
  call,
  prop,
}: {
  name: string;
  component: (props: never) => JSX.Element;
  namespace: string;
  arg: number;
  call: number;
  prop: string;
}) => {
  it(`should call ${name} with a translation function for the namespace: ${namespace}`, () => {
    const tProp = (component as jest.Mock).mock.calls[arg][call][prop];
    expect(tProp).toBeInstanceOf(mockTProp);
    expect(tProp.namespace).toBe(namespace);
  });
};

export const _t = (value: string) => `t(${value})`;

export default mockLocaleHook;
