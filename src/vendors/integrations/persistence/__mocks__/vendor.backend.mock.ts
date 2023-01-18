import type PersistenceVendorBaseClass from "../backend/client/bases/persistence.base.client.class";

export const mockPersistenceClient = {
  write: jest.fn(),
} as Record<keyof PersistenceVendorBaseClass, jest.Mock>;
