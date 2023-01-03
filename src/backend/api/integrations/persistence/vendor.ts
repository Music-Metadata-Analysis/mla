import S3PersistenceClient from "./client/s3";
import type { PersistenceVendorInterface } from "@src/types/integrations/persistence/vendor.types";

const persistenceVendor: PersistenceVendorInterface = {
  PersistenceClient: S3PersistenceClient,
};

export default persistenceVendor;
