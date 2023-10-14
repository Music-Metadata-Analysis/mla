import {
  mockLocaleVendorHook,
  MockLocaleVendorUseTranslation,
} from "@src/vendors/integrations/locale/__mocks__/vendor.mock";
export {
  _t,
  MockLocaleVendorUseTranslation as MockUseTranslation,
} from "@src/vendors/integrations/locale/__mocks__/vendor.mock";

export const mockTranslations: Record<string, MockLocaleVendorUseTranslation> =
  {};

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
    expect(tProp).toBe(mockTranslations[params.namespace].t);
  });
};

const mockValues = mockLocaleVendorHook;
export default mockValues;
