import { MockErrorBoundary } from "./vendor.mock";
import type { ErrorVendorInterface } from "@src/vendors/types/integrations/errors/vendor.types";

export const errorVendor: ErrorVendorInterface = {
  ErrorBoundary: MockErrorBoundary,
};
