import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NextI18NextClientSSR from "../next-i18next";
const i18n = require("@src/../next-i18next.config");

jest.mock("next-i18next/serverSideTranslations");

const MockedServerSideTranslations = jest.mocked(serverSideTranslations);

describe("NextI18NextClientSSR", () => {
  const mockLocale = "mockLocale";
  const mockNamesSpaces = ["one", "two", "three"];
  const mockTranslationData = { _nextI18Next: {} } as Awaited<
    ReturnType<typeof serverSideTranslations>
  >;
  let instance: NextI18NextClientSSR;

  beforeEach(() => {
    jest.clearAllMocks();
    instance = new NextI18NextClientSSR(mockLocale, mockNamesSpaces);
  });

  describe("getTranslations", () => {
    let result: unknown;

    beforeEach(async () => {
      MockedServerSideTranslations.mockResolvedValueOnce(mockTranslationData);
      result = await instance.getTranslations();
    });

    it("should call the vendor serverSideTranslations function correctly", () => {
      expect(serverSideTranslations).toHaveBeenCalledTimes(1);
      expect(serverSideTranslations).toHaveBeenCalledWith(
        mockLocale,
        mockNamesSpaces,
        i18n
      );
    });

    it("should return the vendor serverSideTranslations function's result", () => {
      expect(result).toBe(mockTranslationData);
    });
  });
});
