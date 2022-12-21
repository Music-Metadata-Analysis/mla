import S3PersistenceClient from "./client/s3";
import type { PersistanceVendorInterface } from "@src/types/integrations/persistance/vendor.types";

const persistanceVendor: PersistanceVendorInterface = {
  PersistanceClient: S3PersistenceClient,
};

export default persistanceVendor;
