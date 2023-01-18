import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "./vendor.backend.types";
import type {
  BaseMockRequestType,
  BaseMockResponseType,
  MockRequestType,
  MockResponseType,
} from "@src/vendors/integrations/api.framework/_types/vendor.specific.types";

export type MockAPIEndpointRequestType = MockRequestType<
  ApiFrameworkVendorApiRequestType & BaseMockRequestType
>;

export type MockAPIEndpointResponseType = MockResponseType<
  ApiFrameworkVendorApiResponseType & BaseMockResponseType
>;
