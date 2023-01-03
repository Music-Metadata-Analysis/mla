export interface CacheControllerInterface<ObjectType> {
  logCacheHitRate(): void;
  query(keyName?: string): Promise<ObjectType>;
}
