import { PutObjectCommand } from "@aws-sdk/client-s3";
import Scraper from "./scraper.class";
import S3BaseClient from "../s3/s3.base.client.class";

export default class S3Cache extends S3BaseClient {
  cloudFrontDomainName: string;
  scraper: Scraper;
  scraperRetries = 2;
  defaultResponse = "";

  constructor(bucketName: string) {
    super(bucketName);
    this.cloudFrontDomainName =
      process.env.LASTFM_CACHE_AWS_CLOUDFRONT_DOMAIN_NAME;
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
                Bucket: this.bucketName,
                Key: artistName,
                ContentType: "text/plain",
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
