import { S3Client } from "@aws-sdk/client-s3";

export default class S3BaseClient {
  awsRegion: string;
  bucketName: string;
  s3client: S3Client;

  constructor(bucketName: string) {
    this.awsRegion = process.env.MLA_AWS_REGION;
    this.bucketName = bucketName;
    this.s3client = new S3Client({
      region: process.env.MLA_AWS_REGION,
      credentials: {
        accessKeyId: process.env.MLA_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.MLA_AWS_SECRET_ACCESS_KEY,
      },
    });
  }
}
