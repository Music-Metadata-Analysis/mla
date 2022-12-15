import type { CacheControllerInterface } from "@src/backend/types/cache/controller.types";

export interface CacheControllerFactoryInterface<ObjectType> {
  create(): CacheControllerInterface<ObjectType>;
}
