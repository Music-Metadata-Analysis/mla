import LastFMApiEndpointFactoryV2 from "@src/backend/api/services/lastfm/endpoints/v2.endpoint.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { LastFMProxyInterface } from "@src/backend/api/types/services/lastfm/proxy.types";
import type {
  ApiEndpointRequestType,
  ApiEndpointRequestPathParamType,
} from "@src/backend/api/types/services/request.types";

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
  ): [ApiEndpointRequestPathParamType, boolean] {
    const params = req.query as ApiEndpointRequestPathParamType;
    const error = !params.artist || !params.album || !params.username;
    return [params, error];
  }

  protected getProxyResponse = async (
    params: ApiEndpointRequestPathParamType
  ) => {
    return await this.proxy.getAlbumInfo(
      params.artist,
      params.album,
      params.username
    );
  };
}

export const endpointFactory = new ArtistTopAlbums();
export default endpointFactory.createHandler();
