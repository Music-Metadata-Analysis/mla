import * as status from "@src/config/status";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";

export default async function callbackRedirect(
  req: ApiFrameworkVendorApiRequestType,
  res: ApiFrameworkVendorApiResponseType
) {
  if (req.method !== "GET") {
    res.status(405).json(status.STATUS_405_MESSAGE);
  } else if (!req.query.token) {
    res.status(400).json(status.STATUS_400_MESSAGE);
  } else {
    const redirectUrl = new URL(
      process.env.NEXTAUTH_URL + "/api/auth/callback/lastfm"
    );
    redirectUrl.searchParams.append("id_token", String(req.query.token));

    res.redirect(302, redirectUrl.toString());
  }
}
