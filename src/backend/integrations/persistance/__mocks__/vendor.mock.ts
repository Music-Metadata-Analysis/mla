import type PersistanceVendorBaseClass from "../client/bases/persistance.base.client.class";

export const mockPersistanceClient = {
  write: jest.fn(),
} as Record<keyof PersistanceVendorBaseClass, jest.Mock>;
