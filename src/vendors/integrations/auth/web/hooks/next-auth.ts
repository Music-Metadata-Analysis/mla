import { useSession, signIn, signOut } from "next-auth/react";
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

  const mapStatus = {
    authenticated: "authenticated" as const,
    loading: "processing" as const,
    unauthenticated: "unauthenticated" as const,
  };

  const mapSession = (session: Session | null) => {
    if (status !== "authenticated") return null;
    return {
      name: session?.user?.name ? session?.user?.name : undefined,
      email: session?.user?.email ? session?.user?.email : undefined,
      image: session?.user?.image ? session?.user?.image : undefined,
      group: session?.group ? (session?.group as string) : undefined,
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
    status: mapStatus[status],
    user: mapSession(data),
  };
};

export default useNextAuth;
