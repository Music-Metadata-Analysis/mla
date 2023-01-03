import LastFm from "@toplast/lastfm";
import { ProxyError } from "@src/backend/api/services/lastfm/proxy/error/proxy.error.class";
import type { LastFMExternalClientError } from "@src/types/integrations/lastfm/client.types";

class LastFmClientAdapterBase {
  externalClient: LastFm;
  secret_key: string;

  constructor(secret_key: string) {
    this.secret_key = secret_key;
    this.externalClient = new LastFm(this.secret_key);
  }

  createProxyCompatibleError(err: LastFMExternalClientError): ProxyError {
    return new ProxyError(err.message, err.statusCode);
  }
}

export default LastFmClientAdapterBase;
