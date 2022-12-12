import LastFMApiEndpointFactoryV2 from "@src/backend/api/lastfm/endpoints/v2.endpoint.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type {
  ApiEndpointRequestType,
  RequestPathParamType,
} from "@src/types/api/request.types";
import type { LastFMProxyInterface } from "@src/types/integrations/lastfm/proxy.types";

class ArtistTopAlbums extends LastFMApiEndpointFactoryV2 {
  public readonly flag = null;
  public readonly route = apiRoutes.v2.data.artists.albumsGet;

  protected isProxyResponseValid(
    proxyResponse: Awaited<
      ReturnType<LastFMProxyInterface[keyof LastFMProxyInterface]>
    >
  ) {
    if (proxyResponse.hasOwnProperty("userplaycount")) {
      if (
        typeof (proxyResponse as { userplaycount?: unknown }).userplaycount ===
        "object"
      ) {
        return false;
      }
    }
    return true;
  }

  protected getParams(
    req: ApiEndpointRequestType
  ): [RequestPathParamType, boolean] {
    const params = req.query as RequestPathParamType;
    const error = !params.artist || !params.album || !params.username;
    return [params, error];
  }

  protected getProxyResponse = async (params: RequestPathParamType) => {
    return await this.proxy.getAlbumInfo(
      params.artist,
      params.album,
      params.username
    );
  };
}

export const endpointFactory = new ArtistTopAlbums();
export default endpointFactory.createHandler();
