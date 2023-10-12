import ProxyError from "./backend/proxy/proxy.error.class";
import type { ErrorVendorBackendInterface } from "@src/vendors/types/integrations/errors/vendor.backend.types";

export const errorVendorBackend: ErrorVendorBackendInterface = {
  ProxyError,
};
