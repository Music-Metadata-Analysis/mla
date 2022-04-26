import LastFMApiEndpointFactoryV2 from "../../../../../../../../../backend/api/lastfm/v2.endpoint.base.class";
import apiRoutes from "../../../../../../../../../config/apiRoutes";
import type {
  LastFMEndpointRequest,
  PathParamType,
} from "../../../../../../../../../types/api.endpoint.types";

class ArtistTopAlbums extends LastFMApiEndpointFactoryV2 {
  route = apiRoutes.v2.data.artists.tracksGet;
  maxAgeValue = 3600 * 24;

  getParams(req: LastFMEndpointRequest): [PathParamType, boolean] {
    const params = req.query as PathParamType;
    const error = !params.artist || !params.track || !params.username;
    return [params, error];
  }

  getProxyResponse = async (params: PathParamType) => {
    return await this.proxy.getTrackInfo(
      params.artist,
      params.track,
      params.username
    );
  };
}

export const endpointFactory = new ArtistTopAlbums();
export default endpointFactory.create();
