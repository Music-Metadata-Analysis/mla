import authVendor from "@src/backend/api/integrations/auth/vendor";
import LastFMApiEndpointFactoryV2 from "@src/backend/api/services/lastfm/endpoints/v2.endpoint.base.class";

jest.mock("@src/backend/api/integrations/auth/vendor");

jest.mock("@src/backend/api/services/lastfm/endpoints/v2.endpoint.base.class");

const exports = {
  authVendor,
  LastFMApiEndpointFactoryV2,
};

export default exports;
