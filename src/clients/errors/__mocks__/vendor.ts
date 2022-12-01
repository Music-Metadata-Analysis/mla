import { MockErrorBoundary } from "./vendor.mock";
import type { ErrorVendor } from "@src/types/clients/errors/vendor.types";

const errorVendor: ErrorVendor = {
  ErrorBoundary: MockErrorBoundary,
};

export default errorVendor;
