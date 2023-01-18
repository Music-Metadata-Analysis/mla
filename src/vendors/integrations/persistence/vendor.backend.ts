import S3PersistenceClient from "./backend/client/s3";
import type { PersistenceVendorBackendInterface } from "@src/vendors/types/integrations/persistence/vendor.backend.types";

export const persistenceVendorBackend: PersistenceVendorBackendInterface = {
  PersistenceClient: S3PersistenceClient,
};
