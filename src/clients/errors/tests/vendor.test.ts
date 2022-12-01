import ReactErrorBoundaryContainer from "../boundary/react-error-boundary";
import errorVendor from "../vendor";

describe("errorVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(errorVendor.ErrorBoundary).toBe(ReactErrorBoundaryContainer);
  });
});
