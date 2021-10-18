import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Scraper from "./scraper.class";

export default class S3Cache {
  awsRegion: string;
  cacheBucketName: string;
  cloudFrontDomainName: string;
  s3client: S3Client;
  scraper: Scraper;
  scraperRetries = 2;
  defaultResponse = "";

  constructor() {
    this.awsRegion = process.env.LASTFM_CACHE_AWS_REGION;
    this.cacheBucketName = process.env.LASTFM_CACHE_AWS_S3_BUCKET_NAME;
    this.cloudFrontDomainName =
      process.env.LASTFM_CACHE_AWS_CLOUDFRONT_DOMAIN_NAME;
    this.s3client = new S3Client({
      region: process.env.LASTFM_CACHE_AWS_REGION,
      credentials: {
        accessKeyId: process.env.LASTFM_CACHE_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.LASTFM_CACHE_AWS_SECRET_ACCESS_KEY,
      },
    });
    this.scraper = new Scraper();
  }

  getCloudFrontPrefix() {
    return `https://${this.cloudFrontDomainName}/`;
  }

  async lookup(artistName: string | undefined) {
    if (artistName) {
      return fetch(
        this.getCloudFrontPrefix() + encodeURIComponent(artistName),
        {
          method: "GET",
        }
      ).then(async (response) => {
        if (!response.ok) {
          return this.scraper
            .getArtistImage(artistName, this.scraperRetries)
            .then(async (response) => {
              const command = new PutObjectCommand({
                Body: response,
                Bucket: this.cacheBucketName,
                Key: artistName,
              });
              return this.s3client
                .send(command)
                .then(() => Promise.resolve(response));
            });
        } else {
          return response.text();
        }
      });
    } else {
      return Promise.resolve(this.defaultResponse);
    }
  }
}
