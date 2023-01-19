import { errorVendor } from "../vendor";
import ReactErrorBoundaryContainer from "../web/boundary/react-error-boundary";

describe("errorVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(errorVendor.ErrorBoundary).toBe(ReactErrorBoundaryContainer);
  });
});
