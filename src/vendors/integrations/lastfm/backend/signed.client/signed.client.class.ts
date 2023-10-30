import { createHash } from "crypto";
import config from "@src/config/lastfm";
import type {
  LastFMVendorSignedClientInterface,
  LastFMVendorSignedRequestInterface,
} from "@src/vendors/types/integrations/lastfm/vendor.backend.types";

class LastFMSignedClient implements LastFMVendorSignedClientInterface {
  protected apikey: string;
  protected sharedSecret: string;

  constructor(apiKey: string, sharedSecret: string) {
    this.apikey = apiKey;
    this.sharedSecret = sharedSecret;
  }

  public async signedRequest({
    method,
    params,
    sk,
  }: LastFMVendorSignedRequestInterface & { sk?: string }): Promise<Response> {
    try {
      const response = await fetch(this.getSignedUrl({ method, params, sk }));
      if (response.ok) {
        return response;
      }
    } catch {
      console.error(
        `(${LastFMSignedClient.name}) Network error calling last.fm api method: '${method}' !`
      );
    }
    throw new Error(
      `(${LastFMSignedClient.name}) Unable to call last.fm api method: '${method}' !`
    );
  }

  protected getSignedUrl({
    method,
    params,
    sk,
  }: LastFMVendorSignedRequestInterface & { sk?: string }): string {
    const url = new URL(config.apiRoot);
    url.searchParams.append("method", method);
    url.searchParams.append("api_key", this.apikey);
    const sortedParams = this.getSortedParams({ method, params, sk });
    sortedParams.forEach(([k, v]) => url.searchParams.append(k, v));
    url.searchParams.append(
      "api_sig",
      this.getSignature({ method, params: sortedParams })
    );
    url.searchParams.append("format", "json");
    return url.toString();
  }

  protected getSortedParams({
    params,
    sk,
  }: LastFMVendorSignedRequestInterface & { sk?: string }): [string, string][] {
    const sortedParams = [...params];
    if (sk) {
      sortedParams.push(["sk", sk]);
    }
    return sortedParams.sort(([ak], [bk]) => {
      if (ak < bk) {
        return -1;
      } else if (ak > bk) {
        return 1;
      }
      return 0;
    });
  }

  protected getSignature({
    method,
    params,
  }: LastFMVendorSignedRequestInterface): string {
    let signature = `api_key${this.apikey}`;
    signature += `method${method}`;
    signature += params.map(([k, v]) => k + v).join("");
    signature += this.sharedSecret;
    return createHash("md5").update(signature).digest("hex");
  }
}

export default LastFMSignedClient;
