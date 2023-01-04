jest.mock("@src/backend/api/integrations/auth/vendor", () =>
  require("@src/backend/api/integrations/auth/__mocks__/vendor.mock.ts").authenticated()
);

const emptyExport = {};

export default emptyExport;
