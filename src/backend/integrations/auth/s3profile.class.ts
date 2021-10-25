import { PutObjectCommand } from "@aws-sdk/client-s3";
import S3BaseClient from "../s3/s3.base.client.class";
import type { Profile } from "next-auth";

export default class S3Profile extends S3BaseClient {
  async writeProfileToS3(profile?: Profile) {
    if (profile?.email) {
      const command = new PutObjectCommand({
        Body: JSON.stringify(profile),
        Bucket: this.bucketName,
        Key: profile?.email,
        ContentType: "application/json",
      });
      await this.s3client.send(command);
    }
  }
}
