import validator from "../validator";
import testState1 from "@src/contracts/api/services/lastfm/fixtures/aggregates/playcount.by.artist/lastfm.report.state.playcount.by.artist.sunburst.complete.1.json";
import testState2 from "@src/contracts/api/services/lastfm/fixtures/aggregates/playcount.by.artist/lastfm.report.state.playcount.by.artist.sunburst.complete.2.json";
import type { ApiValidationVendorResponseInterface } from "@src/vendors/types/integrations/api.validator/vendor.backend.types";

describe("last.fm Playcount by Artist JSON Schema", () => {
  let data: Record<string | number | symbol, unknown>;

  describe.each([
    ["complete report 1", testState1],
    ["complete report 2", testState2],
  ])(
    "with JSON data from %s",

    (reportName, reportContent) => {
      beforeEach(() => {
        data = { ...reportContent };
      });

      describe("when the complete report is valid", () => {
        let result: ApiValidationVendorResponseInterface;

        beforeEach(() => {
          result = validator(data);
        });

        it("should pass validation", () => {
          expect(result.valid).toBe(true);
          expect(result.errors).toBeNull();
        });
      });

      describe("when the complete report is invalid", () => {
        let result: ApiValidationVendorResponseInterface;

        beforeEach(() => {
          data = { ...reportContent };
          data["newProperty"] = "Invalid";
          result = validator(data);
        });

        it("should not pass validation", () => {
          expect(result.valid).toBe(false);
        });

        it("should return the expected error", () => {
          expect(result.errors).toStrictEqual([
            {
              instancePath: "",
              schemaPath: "#/additionalProperties",
              keyword: "additionalProperties",
              params: { additionalProperty: "newProperty" },
              message: "must NOT have additional properties",
            },
          ]);
        });
      });
    }
  );
});
