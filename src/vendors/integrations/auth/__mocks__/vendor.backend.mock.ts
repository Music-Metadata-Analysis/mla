import { mockSession } from "@src/vendors/integrations/api.framework/fixtures";
import type { AuthVendorClientInterface } from "@src/vendors/types/integrations/auth/vendor.backend.types";

const mockAuthClientBase = {
  getSession: jest.fn(),
} as Record<keyof AuthVendorClientInterface, jest.Mock>;

const createMockAuthClient = ({
  clientOverrides,
}: {
  clientOverrides?: Record<keyof AuthVendorClientInterface, jest.Mock>;
}) => ({
  ...mockAuthClientBase,
  ...clientOverrides,
});

export const mockAuthClient = createMockAuthClient({});

export const authenticated = () => ({
  authVendorBackend: {
    Client: jest.fn(() =>
      createMockAuthClient({
        clientOverrides: {
          getSession: jest.fn(() => Promise.resolve(mockSession)),
        },
      })
    ),
  },
});

export const mockAuthConfig = { maxAge: 1000 };
