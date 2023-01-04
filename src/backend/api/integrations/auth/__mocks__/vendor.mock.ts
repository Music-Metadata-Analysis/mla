import { mockSession } from "@src/backend/api/exports/tests/fixtures/mock.api.messages";
import type { AuthVendorClientInterface } from "@src/backend/api/types/integrations/auth/vendor.types";

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
  Client: jest.fn(() =>
    createMockAuthClient({
      clientOverrides: {
        getSession: jest.fn(() => Promise.resolve(mockSession)),
      },
    })
  ),
});

export const mockAuthConfig = { maxAge: 1000 };
