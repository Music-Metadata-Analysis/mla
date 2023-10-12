import LastFm from "@toplast/lastfm";
import { errorVendorBackend } from "@src/vendors/integrations/errors/vendor.backend";
import type { RemoteServiceError } from "@src/contracts/api/types/services/generics/proxy/proxy.error.types";
import type {
  LastFMVendorClientError,
  LastFMVendorClientBaseType,
} from "@src/vendors/types/integrations/lastfm/vendor.backend.types";

class LastFmClientAdapterBase implements LastFMVendorClientBaseType {
  protected externalClient: LastFm;
  protected readonly secret_key: string;

  constructor(secret_key: string) {
    this.secret_key = secret_key;
    this.externalClient = new LastFm(this.secret_key);
  }

  protected createProxyCompatibleError(
    err: LastFMVendorClientError
  ): RemoteServiceError {
    return new errorVendorBackend.ProxyError(err.message, err.statusCode);
  }
}

export default LastFmClientAdapterBase;
