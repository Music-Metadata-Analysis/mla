import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import VendorPersistenceBaseClass from "./bases/persistence.base.client.class";
import type {
  PersistenceVendorDataType,
  PersistenceVendorClientHeadersInterface,
} from "@src/backend/api/types/integrations/persistence/vendor.types";

export default class S3PersistenceClient extends VendorPersistenceBaseClass {
  protected awsRegion: string;
  protected s3client: S3Client;

  constructor(bucketName: string) {
    super(bucketName);
    this.awsRegion = process.env.MLA_AWS_REGION;
    this.s3client = new S3Client({
      region: process.env.MLA_AWS_REGION,
      credentials: {
        accessKeyId: process.env.MLA_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.MLA_AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  protected async writeImplementation(
    keyName: string,
    data: PersistenceVendorDataType,
    headers: PersistenceVendorClientHeadersInterface
  ): Promise<void> {
    const command = new PutObjectCommand({
      Body: this.normalizeData(data),
      Bucket: this.partitionName,
      Key: keyName,
      ContentType: headers["ContentType"],
      ...(headers["CacheControl"] && { CacheControl: headers["CacheControl"] }),
    });
    await this.s3client.send(command);
  }

  protected normalizeData(data: PersistenceVendorDataType): string {
    if (typeof data === "object") return JSON.stringify(data);
    return data;
  }
}
