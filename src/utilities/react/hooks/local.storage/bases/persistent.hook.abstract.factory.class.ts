import type { useState, useReducer } from "react";

export default abstract class PersistentHookAbstractFactory<
  T extends typeof useState | typeof useReducer
> {
  protected abstract primitiveHook: T;
  protected abstract hookFactory: (partitionName: string) => T;

  create(partitionName: string, isSSR: boolean): T {
    if (isSSR) return this.primitiveHook;
    return this.hookFactory(partitionName);
  }
}
