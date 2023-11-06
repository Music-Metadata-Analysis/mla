import FlagStatusMiddleware from "../flag.status.middleware.class";
import * as status from "@src/config/status";
import { createAPIMocks } from "@src/vendors/integrations/api.framework/fixtures";
import { mockFlagClient } from "@src/vendors/integrations/flags/__mocks__/vendor.backend.mock";
import { flagVendorBackend } from "@src/vendors/integrations/flags/vendor.backend";
import type {
  MockAPIEndpointRequestType,
  MockAPIEndpointResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.fixture.types";

jest.mock("@src/vendors/integrations/flags/vendor.backend");

describe(FlagStatusMiddleware.name, () => {
  let instance: FlagStatusMiddleware;

  let originalEnvironment: typeof process.env;
  let mockReq: MockAPIEndpointRequestType;
  let mockRes: MockAPIEndpointResponseType;

  let flag: string | null;

  const mockNext = jest.fn();
  const mockFinish = jest.fn();

  const mockFlagEnvironment = "mockFlagEnvironment";
  const mockNonNullFlag = "mockNonNullFlag";

  beforeAll(() => {
    originalEnvironment = process.env;
    setupEnv();
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => (instance = new FlagStatusMiddleware(flag));

  const createMocks = () => {
    ({ req: mockReq, res: mockRes } = createAPIMocks({}));
  };

  const setupEnv = () => {
    process.env.NEXT_PUBLIC_FLAG_ENVIRONMENT = mockFlagEnvironment;
  };

  const checkEnabled = () => {
    it("should call the 'next middleware' callback", () => {
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it("should NOT call the 'finish middleware' callback", () => {
      expect(mockFinish).toHaveBeenCalledTimes(0);
    });

    it("should NOT set a response", () => {
      expect(mockRes._getStatusCode()).toBe(200);
      expect(mockRes._getData()).toBe("");
    });
  };

  const checkDisabled = () => {
    it("should NOT call the 'next middleware' callback", () => {
      expect(mockNext).toHaveBeenCalledTimes(0);
    });

    it("should call the 'finish middleware' callback", () => {
      expect(mockFinish).toHaveBeenCalledTimes(1);
      expect(mockFinish).toHaveBeenCalledWith();
    });

    it("should set a 404 response", () => {
      expect(mockRes._getStatusCode()).toBe(404);
      expect(mockRes._getJSONData()).toStrictEqual(status.STATUS_404_MESSAGE);
    });
  };

  const checkFlagVendorCalls = () => {
    it("should initialize the flag vendor client as expected", () => {
      expect(flagVendorBackend.Client).toHaveBeenCalledTimes(1);
      expect(flagVendorBackend.Client).toHaveBeenCalledWith(
        mockFlagEnvironment
      );
    });

    it("should call the flag vendor client's isEnabled method as expected", () => {
      expect(mockFlagClient.isEnabled).toHaveBeenCalledTimes(1);
      expect(mockFlagClient.isEnabled).toHaveBeenCalledWith(flag);
    });
  };

  describe("with a bypassed flag", () => {
    beforeEach(() => {
      flag = null;
    });

    describe("handler", () => {
      describe("with any request", () => {
        beforeEach(async () => {
          arrange();
          createMocks();

          await instance.handler(mockReq, mockRes, mockNext, mockFinish);
        });

        it("should NOT initialize the flag vendor client", () => {
          expect(flagVendorBackend.Client).toHaveBeenCalledTimes(0);
        });

        it("should NOT call the flag vendor client's isEnabled method", () => {
          expect(mockFlagClient.isEnabled).toHaveBeenCalledTimes(0);
        });

        checkEnabled();
      });
    });
  });

  describe("with a disabled flag", () => {
    beforeEach(() => {
      flag = mockNonNullFlag;
      mockFlagClient.isEnabled.mockReturnValueOnce(false);
    });

    describe("handler", () => {
      describe("with any request", () => {
        beforeEach(async () => {
          arrange();
          createMocks();

          await instance.handler(mockReq, mockRes, mockNext, mockFinish);
        });

        checkFlagVendorCalls();
        checkDisabled();
      });
    });
  });

  describe("with an enabled flag", () => {
    beforeEach(() => {
      flag = mockNonNullFlag;
      mockFlagClient.isEnabled.mockReturnValueOnce(true);
    });

    describe("handler", () => {
      describe("with any request", () => {
        beforeEach(async () => {
          arrange();
          createMocks();

          await instance.handler(mockReq, mockRes, mockNext, mockFinish);
        });

        checkFlagVendorCalls();
        checkEnabled();
      });
    });
  });
});
