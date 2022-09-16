import S3PersistenceClient from "./s3/s3.client.class";
import type { PersistanceVendor } from "../../../types/integrations/persistance/vendor.types";

const persistanceVendor: PersistanceVendor = {
  PersistanceClient: S3PersistenceClient,
};

export default persistanceVendor;
