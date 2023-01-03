import type { CacheControllerInterface } from "@src/backend/api/types/cache/controller.types";

export interface CacheControllerFactoryInterface<ObjectType> {
  create(): CacheControllerInterface<ObjectType>;
}
