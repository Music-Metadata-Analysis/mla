import compiledValidator from "../ajv/generated";
import validator from "../validator";
import type { ApiValidationVendorResponseInterface } from "@src/vendors/types/integrations/api.validator/vendor.backend.types";
import type { ErrorObject } from "ajv";

jest.mock("../ajv/generated.js");

describe("last.fm playcount by artist validator", () => {
  const mockData = { mock: "report" };
  let mockValidity: boolean;
  let mockErrors: string[] | undefined;
  let result: ApiValidationVendorResponseInterface;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const act = () => {
    jest.mocked(compiledValidator).mockImplementation(() => mockValidity);
    (
      compiledValidator as typeof compiledValidator & { errors: ErrorObject[] }
    ).errors = mockErrors as unknown as ErrorObject[];
    result = validator(mockData);
  };

  describe("with a valid mock schema response", () => {
    beforeEach(() => {
      mockValidity = true;
      mockErrors = undefined;
    });

    describe("when called", () => {
      beforeEach(() => act());

      it("should call the underlying AJV validator correctly", () => {
        expect(compiledValidator).toHaveBeenCalledTimes(1);
        expect(compiledValidator).toHaveBeenCalledWith(mockData);
      });

      it("should return the expected value", () => {
        expect(result.valid).toBe(mockValidity);
        expect(result.errors).toBeUndefined();
      });
    });
  });

  describe("with an invalid mock schema response", () => {
    beforeEach(() => {
      mockValidity = true;
      mockErrors = ["mockError1", "mockError2"];
    });

    describe("when called", () => {
      beforeEach(() => act());

      it("should call the underlying AJV validator correctly", () => {
        expect(compiledValidator).toHaveBeenCalledTimes(1);
        expect(compiledValidator).toHaveBeenCalledWith(mockData);
      });

      it("should return the expected value", () => {
        expect(result.valid).toBe(mockValidity);
        expect(result.errors).toBe(mockErrors);
      });
    });
  });
});
