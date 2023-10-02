import { useSession, signIn, signOut } from "next-auth/react";
import { normalizeUndefined } from "@src/utilities/generics/voids";
import PersistentStateFactory from "@src/utilities/react/hooks/local.storage/persisted.state.hook.factory.class";
import { webFrameworkVendor } from "@src/vendors/integrations/web.framework/vendor";
import type {
  AuthVendorHookInterface,
  AuthVendorServiceType,
} from "@src/vendors/types/integrations/auth/vendor.types";
import type { Session } from "next-auth";

const useNextAuth = (): AuthVendorHookInterface => {
  const [oauth, setOauth] = new PersistentStateFactory().create(
    "oauth",
    webFrameworkVendor.isSSR()
  )<{
    type: AuthVendorServiceType | null;
  }>({
    type: null,
  });
  const { data, status } = useSession();

  const mapStatus = (status: keyof typeof statusHash) => {
    if (status == "authenticated" && !data) {
      status = "unauthenticated" as const;
    }

    const statusHash = {
      authenticated: "authenticated" as const,
      loading: "processing" as const,
      unauthenticated: "unauthenticated" as const,
    };

    return statusHash[status];
  };

  const mapSession = (session: Session | null) => {
    if (status !== "authenticated" || !session || !session.user) return null;
    return {
      name: normalizeUndefined(session.user.name),
      email: normalizeUndefined(session.user.email),
      image: normalizeUndefined(session.user.image),
      group: normalizeUndefined(session.group),
      oauth: oauth.type as AuthVendorServiceType,
    };
  };

  const signInWithOauth = (oauthService: AuthVendorServiceType) => {
    setOauth({ type: oauthService });
    signIn(oauthService);
  };

  const signOutWithOauth = () => {
    setOauth({ type: null });
    signOut();
  };

  return {
    signIn: signInWithOauth,
    signOut: signOutWithOauth,
    status: mapStatus(status),
    user: mapSession(data),
  };
};

export default useNextAuth;
