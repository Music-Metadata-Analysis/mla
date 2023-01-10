import { mockFlagsHook } from "@src/vendors/integrations/flags/__mocks__/vendor.mock";
import type { FlagVendorHookInterface } from "@src/vendors/types/integrations/flags/vendor.types";

const mockValues: Record<keyof FlagVendorHookInterface, jest.Mock> =
  mockFlagsHook;

export default mockValues;
