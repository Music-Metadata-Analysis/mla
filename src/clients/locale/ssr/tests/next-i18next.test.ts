import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NextI18NextSSR from "../next-i18next";

jest.mock("next-i18next/serverSideTranslations", () => ({
  serverSideTranslations: jest.fn(),
}));

describe("NextI18NextSSR", () => {
  const mockLocale = "mockLocale";
  const mockNamesSpaces = ["one", "two", "three"];
  const mockTranslationData = "mockTranslationData";
  let instance: NextI18NextSSR;

  beforeEach(() => {
    jest.clearAllMocks();
    instance = new NextI18NextSSR(mockLocale, mockNamesSpaces);
  });

  describe("getTranslations", () => {
    let result: unknown;

    beforeEach(async () => {
      (serverSideTranslations as jest.Mock).mockReturnValue(
        mockTranslationData
      );
      result = await instance.getTranslations();
    });

    it("should call the vendor serverSideTranslations function correctly", () => {
      expect(serverSideTranslations).toBeCalledTimes(1);
      expect(serverSideTranslations).toBeCalledWith(
        mockLocale,
        mockNamesSpaces
      );
    });

    it("should return the vendor serverSideTranslations function's result", () => {
      expect(result).toBe(mockTranslationData);
    });
  });
});
