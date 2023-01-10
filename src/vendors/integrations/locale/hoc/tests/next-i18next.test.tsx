import { appWithTranslation } from "next-i18next";
import nextI18NextHOC from "../next-i18next";

describe("nextI18NextHOC", () => {
  it("should return the vendor's appWithTranslation function", () => {
    expect(nextI18NextHOC).toBe(appWithTranslation);
  });
});
