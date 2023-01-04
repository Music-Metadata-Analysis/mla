import authVendor from "../integrations/auth/vendor";
import LastFMApiEndpointFactoryV2 from "../services/lastfm/endpoints/v2.endpoint.base.class";

export const LastFMApiEndpointFactory = LastFMApiEndpointFactoryV2;

export const authenticationIntegration = authVendor;
