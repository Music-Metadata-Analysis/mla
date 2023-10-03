import type { useState, useReducer } from "react";

export interface PersistanceVendorFactoryInterface<
  T extends typeof useState | typeof useReducer
> {
  create(partitionName: string, isSSR: boolean): T;
}

export interface PersistenceVendorInterface {
  localStorageHookFactory: new () => PersistanceVendorFactoryInterface<
    typeof useState
  >;
  localStorageReducerFactory: new () => PersistanceVendorFactoryInterface<
    typeof useReducer
  >;
}
