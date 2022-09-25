import LastFMApiEndpointFactoryV2 from "@src/backend/api/lastfm/v2.endpoint.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type {
  LastFMEndpointRequest,
  PathParamType,
} from "@src/types/api.endpoint.types";

class ArtistTopAlbums extends LastFMApiEndpointFactoryV2 {
  route = apiRoutes.v2.data.artists.albumsList;
  maxAgeValue = 3600 * 24;

  getParams(req: LastFMEndpointRequest): [PathParamType, boolean] {
    const params = req.query as PathParamType;
    const error = !params.artist;
    return [params, error];
  }

  getProxyResponse = async (params: PathParamType) => {
    return await this.proxy.getArtistTopAlbums(params.artist);
  };
}

export const endpointFactory = new ArtistTopAlbums();
export default endpointFactory.create();
