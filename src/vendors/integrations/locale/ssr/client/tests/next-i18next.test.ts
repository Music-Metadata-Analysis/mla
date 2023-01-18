import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NextI18NextClientSSR from "../next-i18next";

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
