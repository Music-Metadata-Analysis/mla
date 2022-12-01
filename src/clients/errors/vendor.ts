import ReactErrorBoundaryContainer from "./boundary/react-error-boundary";
import type { ErrorVendor } from "@src/types/clients/errors/vendor.types";

const errorVendor: ErrorVendor = {
  ErrorBoundary: ReactErrorBoundaryContainer,
};

export default errorVendor;
