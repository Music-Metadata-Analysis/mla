import { mockSession } from "@src/tests/fixtures/mock.authentication";
import type { AuthVendorClientInterface } from "@src/types/integrations/auth/vendor.types";

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
