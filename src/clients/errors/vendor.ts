import ReactErrorBoundaryContainer from "./boundary/react-error-boundary";
import type { ErrorVendorInterface } from "@src/types/clients/errors/vendor.types";

const errorVendor: ErrorVendorInterface = {
  ErrorBoundary: ReactErrorBoundaryContainer,
};

export default errorVendor;
