import LastFMApiEndpointFactoryV2 from "@src/backend/api/lastfm/v2.endpoint.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type {
  LastFMEndpointRequest,
  PathParamType,
} from "@src/types/api.endpoint.types";
import type { LastFMProxyInterface } from "@src/types/integrations/lastfm/proxy.types";

class ArtistTopAlbums extends LastFMApiEndpointFactoryV2 {
  route = apiRoutes.v2.data.artists.albumsGet;
  maxAgeValue = 3600 * 24;

  isProxyResponseValid(
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

  getParams(req: LastFMEndpointRequest): [PathParamType, boolean] {
    const params = req.query as PathParamType;
    const error = !params.artist || !params.album || !params.username;
    return [params, error];
  }

  getProxyResponse = async (params: PathParamType) => {
    return await this.proxy.getAlbumInfo(
      params.artist,
      params.album,
      params.username
    );
  };
}

export const endpointFactory = new ArtistTopAlbums();
export default endpointFactory.create();
