import { webFrameworkVendor } from "@src/vendors/integrations/web.framework/vendor";
import type { useState, useReducer } from "react";

export default abstract class PersistentHookAbstractFactory<
  T extends typeof useState | typeof useReducer
> {
  protected abstract primitiveHook: T;
  protected abstract hookFactory: (partitionName: string) => T;

  create(partitionName: string) {
    if (webFrameworkVendor.isSSR()) return this.primitiveHook;
    return this.hookFactory(partitionName);
  }
}
