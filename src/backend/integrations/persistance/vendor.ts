import S3PersistenceClient from "./client/s3";
import type { PersistanceVendor } from "../../../types/integrations/persistance/vendor.types";

const persistanceVendor: PersistanceVendor = {
  PersistanceClient: S3PersistenceClient,
};

export default persistanceVendor;
