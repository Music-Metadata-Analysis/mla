import ErrorBoundaryContainer from "../error.boundary.container";
import errorVendor from "@src/clients/errors/vendor";

jest.mock("@src/clients/errors/vendor");

describe(ErrorBoundaryContainer.name, () => {
  it("should be provided by the error vendor", () => {
    expect(errorVendor.ErrorBoundary).toBe(ErrorBoundaryContainer);
  });
});
