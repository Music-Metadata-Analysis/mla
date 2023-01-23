import { MockUseTranslation, mockTranslations } from "./translation.hook.mock";

export default jest.fn((ns: string) => {
  mockTranslations[ns] = new MockUseTranslation(ns);
  return { t: mockTranslations[ns].t };
});
