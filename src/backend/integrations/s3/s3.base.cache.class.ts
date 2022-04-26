import { PutObjectCommand } from "@aws-sdk/client-s3";
import S3BaseClient from "../s3/s3.base.client.class";

export default abstract class S3Cache<ObjectType> extends S3BaseClient {
  cloudFrontDomainName: string;
  cacheFolderName!: string;
  cacheContentType!: string;
  defaultResponse!: ObjectType;
  requestCount = 0;
  cacheHitCount = 0;
  private instanceCache: Record<string, ObjectType> = {};

  constructor(bucketName: string) {
    super(bucketName);
    this.cloudFrontDomainName =
      process.env.LASTFM_CACHE_AWS_CLOUDFRONT_DOMAIN_NAME;
  }

  logCacheHitRate() {
    if (this.requestCount > 0) {
      const hitRate = (this.cacheHitCount / this.requestCount) * 100;
      console.log(`[S3 CACHE] hit rate: ${hitRate.toFixed(2)}%`);
    }
  }

  async lookup(objectName: string | undefined): Promise<ObjectType> {
    if (objectName) {
      const internalCache = this.queryInstanceCache(objectName);
      if (internalCache) {
        return internalCache;
      }
      return this.queryS3Cache(objectName);
    }
    return Promise.resolve(this.defaultResponse);
  }

  private queryInstanceCache(objectName: string): ObjectType {
    return this.instanceCache[objectName];
  }

  private async queryS3Cache(objectName: string): Promise<ObjectType> {
    this.requestCount += 1;
    return fetch(
      this.getCloudFrontPrefix() + this.getEncodedKeyName(objectName),
      {
        method: "GET",
      }
    ).then(async (response) => {
      // todo: validate response is not empty?
      if (!response.ok) {
        const newEntry = await this.createEntry(objectName);
        await this.populateS3Cache(objectName, this.stringifyObject(newEntry));
        this.populateInstanceCache(objectName, newEntry);
        return newEntry;
      }
      this.incrementCacheHitCount(response);
      const cachedValue = await this.getResponseValue(response);
      this.populateInstanceCache(objectName, cachedValue);
      return cachedValue;
    });
  }

  private getCloudFrontPrefix() {
    return `https://${this.cloudFrontDomainName}/`;
  }

  private getEncodedKeyName(objectName: string) {
    return `${this.cacheFolderName}/${encodeURIComponent(objectName)}`;
  }

  private getKeyName(objectName: string) {
    return `${this.cacheFolderName}/${objectName}`;
  }

  private incrementCacheHitCount(response: Response) {
    const cache_header = response.headers.get("x-cache");
    if (cache_header && cache_header.includes("Hit")) {
      this.cacheHitCount += 1;
    }
  }

  private populateInstanceCache(objectName: string, newEntry: ObjectType) {
    this.instanceCache[objectName] = newEntry;
  }

  private async populateS3Cache(objectName: string, stringValue: string) {
    const command = new PutObjectCommand({
      Body: stringValue,
      Bucket: this.bucketName,
      Key: this.getKeyName(objectName),
      ContentType: this.cacheContentType,
    });
    await this.s3client.send(command);
  }

  abstract createEntry(objectName: string): Promise<ObjectType>;

  abstract stringifyObject(newEntry: ObjectType): string;

  abstract getResponseValue(response: Response): Promise<ObjectType>;
}
