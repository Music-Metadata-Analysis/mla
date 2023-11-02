import Ajv, { ValidateFunction } from "ajv";
import standaloneCode from "ajv/dist/standalone";
import fs from "fs";
import path from "path";
import schema from "@src/contracts/api/services/report.cache/lastfm/schemas/playcount.by.artist.json";

jest.mock("ajv/dist/standalone", () => jest.fn());
jest.mock("ajv");
jest.mock("fs");

describe("playcount.by.artist validator compiler", () => {
  const mockCompiledValidator = jest.fn();
  const mockCompiledCode = "mockCompiledCode";

  beforeEach(() => {
    jest
      .mocked(jest.mocked(Ajv.prototype.compile))
      .mockImplementation(
        () => mockCompiledValidator as unknown as ValidateFunction
      );
    jest.mocked(standaloneCode).mockImplementation(() => mockCompiledCode);
  });

  describe("when imported", () => {
    beforeEach(() => {
      require("../compile");
    });

    it("should compile the correct schema", () => {
      expect(Ajv).toHaveBeenCalledTimes(1);
      expect(jest.mocked(Ajv).mock.instances[0].compile).toHaveBeenCalledTimes(
        1
      );
      expect(jest.mocked(Ajv).mock.instances[0].compile).toHaveBeenCalledWith(
        schema
      );
    });

    it("should create a standalone function", () => {
      expect(standaloneCode).toHaveBeenCalledTimes(1);
      expect(standaloneCode).toHaveBeenCalledWith(
        jest.mocked(Ajv).mock.instances[0],
        mockCompiledValidator
      );
    });

    it("should write the expected output", () => {
      expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(__dirname, "../generated.js"),
        mockCompiledCode
      );
    });
  });
});
