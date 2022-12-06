import { MockUseLocale, mockLocales } from "./locale.hook.mock";

export default jest.fn((ns: string) => {
  mockLocales[ns] = new MockUseLocale(ns);
  return { t: mockLocales[ns].t };
});
