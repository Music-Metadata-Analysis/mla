import ReactErrorBoundaryContainer from "./web/boundary/react-error-boundary";
import type { ErrorVendorInterface } from "@src/vendors/types/integrations/errors/vendor.types";

export const errorVendor: ErrorVendorInterface = {
  ErrorBoundary: ReactErrorBoundaryContainer,
};
