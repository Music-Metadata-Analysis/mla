import compiledValidator from "./ajv/generated";
import type { ApiValidationVendorResponseInterface } from "@src/vendors/types/integrations/api.validator/vendor.backend.types";
import type { ErrorObject } from "ajv";

const validator = (
  payload: Record<string | number | symbol, unknown>
): ApiValidationVendorResponseInterface => {
  const valid = compiledValidator(payload);
  return {
    valid,
    errors: (
      compiledValidator as typeof compiledValidator & { errors: ErrorObject[] }
    ).errors,
  };
};

export default validator;
