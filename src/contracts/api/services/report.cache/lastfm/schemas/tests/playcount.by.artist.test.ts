import Ajv from "ajv";
import schema from "../playcount.by.artist.json";
import testState1 from "@src/contracts/api/services/lastfm/fixtures/aggregates/playcount.by.artist/lastfm.report.state.playcount.by.artist.sunburst.complete.1.json";
import testState2 from "@src/contracts/api/services/lastfm/fixtures/aggregates/playcount.by.artist/lastfm.report.state.playcount.by.artist.sunburst.complete.2.json";

describe("last.fm Playcount by Artist JSON Schema", () => {
  let ajv: Ajv;
  let data: Record<string | number | symbol, unknown>;

  describe.each([
    ["complete report 1", testState1.data.report],
    ["complete report 2", testState2.data.report],
  ])(
    "with JSON data from %s",

    (reportName, reportContent) => {
      beforeEach(() => {
        ajv = new Ajv();
        data = { ...reportContent };
      });

      describe("when the complete report is valid", () => {
        let valid: boolean;

        beforeEach(() => {
          valid = ajv.validate(schema, data);
        });

        it("should pass validation", () => {
          expect(valid).toBe(true);
        });
      });

      describe("when the complete report is invalid", () => {
        let valid: boolean;

        beforeEach(() => {
          data = { ...reportContent };
          data["newProperty"] = "Invalid";
          valid = ajv.validate(schema, data);
        });

        it("should not pass validation", () => {
          expect(valid).toBe(false);
        });

        it("should return the expected error", () => {
          expect(ajv.errors).toStrictEqual([
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
