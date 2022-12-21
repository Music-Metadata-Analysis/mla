import { MockErrorBoundary } from "./vendor.mock";
import type { ErrorVendorInterface } from "@src/types/clients/errors/vendor.types";

const errorVendor: ErrorVendorInterface = {
  ErrorBoundary: MockErrorBoundary,
};

export default errorVendor;
