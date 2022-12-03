import { mockFlagsHook } from "@src/clients/flags/__mocks__/vendor.mock";
import type { FlagVendorHookInterface } from "@src/types/clients/flags/vendor.types";

const mockValues: Record<keyof FlagVendorHookInterface, jest.Mock> =
  mockFlagsHook;

export default mockValues;
