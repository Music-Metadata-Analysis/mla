import { waitFor } from "@testing-library/react";
import ConcreteBaseProxyErrorClass from "./implementations/concrete.endpoint.base.proxy.error.class";
import ConcreteBaseProxySuccessClass from "./implementations/concrete.endpoint.base.proxy.success";
import ConcreteBaseEndpointTimeoutErrorClass from "./implementations/concrete.endpoint.base.timeout.error.class";
import * as status from "@src/config/status";
import { createAPIMocks } from "@src/vendors/integrations/api.framework/fixtures";
import { mockEndpointLogger } from "@src/vendors/integrations/api.logger/__mocks__/vendor.backend.mock";
import type LastFMEndpointBase from "../endpoint.base.class";
import type { HttpApiClientHttpMethodType } from "@src/contracts/api/types/clients/http.client.types";
import type {
  MockAPIEndpointRequestType,
  MockAPIEndpointResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.fixture.types";

jest.mock("@src/vendors/integrations/api.logger/vendor.backend");

describe("LastFMEndpointBase", () => {
  let clearTimeOut: jest.SpyInstance;

  let factoryInstance: LastFMEndpointBase & { errorCode?: number };

  let mockReq: MockAPIEndpointRequestType;
  let mockRes: MockAPIEndpointResponseType;

  let method: HttpApiClientHttpMethodType;

  beforeEach(() => {
    jest.clearAllMocks();
    clearTimeOut = jest.spyOn(window, "clearTimeout");
  });

  const checkTimeoutCleared = () => {
    it("should clear the timeout", async () => {
      await waitFor(() => expect(clearTimeOut).toBeCalledTimes(1));
    });
  };

  const checkTimeoutNotCleared = () => {
    it("should NOT clear the timeout", () => {
      expect(clearTimeOut).toBeCalledTimes(0);
    });
  };

  const checkRetryHeader = () => {
    it("should set a retry-after header", () => {
      expect(mockRes.getHeader("retry-after")).toBe(0);
    });
  };

  const checkNoRetryHeader = () => {
    it("should NOT set a retry-after header", () => {
      expect(mockRes.getHeader("retry-after")).toBeUndefined();
    });
  };

  const checkLogger = () => {
    it("should log a message", () => {
      expect(mockEndpointLogger).toBeCalledTimes(1);

      const call = jest.mocked(mockEndpointLogger).mock.calls[0];
      expect(call[0]).toBe(mockReq);
      expect(call[1]).toBe(mockRes);
      expect(call[2]).toBeInstanceOf(Function);
      expect(call[2].name).toBe("next");
      expect(call.length).toBe(3);
    });
  };

  describe("with a concrete implementation", () => {
    describe("receives a request that succeeds", () => {
      beforeEach(async () => {
        factoryInstance = new ConcreteBaseProxySuccessClass();
        ({ req: mockReq, res: mockRes } = createAPIMocks({
          url: factoryInstance.route,
          method,
        }));
        await factoryInstance.createHandler()(mockReq, mockRes);
      });

      it("should return a 200", () => {
        expect(mockRes._getStatusCode()).toBe(200);
        expect(mockRes._getJSONData()).toStrictEqual([]);
      });

      checkNoRetryHeader();
      checkTimeoutCleared();
      checkLogger();
    });

    describe("receives a request that generates an unknown proxy error", () => {
      beforeEach(async () => {
        factoryInstance = new ConcreteBaseProxyErrorClass();
        ({ req: mockReq, res: mockRes } = createAPIMocks({
          url: factoryInstance.route,
          method,
        }));
        await factoryInstance.createHandler()(mockReq, mockRes);
      });

      it("should return a 502", () => {
        expect(mockRes._getStatusCode()).toBe(502);
        expect(mockRes._getJSONData()).toStrictEqual(status.STATUS_502_MESSAGE);
      });

      checkNoRetryHeader();
      checkTimeoutCleared();
      checkLogger();
    });

    describe.each([
      ["unauthorized", 401, status.STATUS_401_MESSAGE],
      ["notfound", 404, status.STATUS_404_MESSAGE],
      ["ratelimited", 429, status.STATUS_429_MESSAGE],
      ["unavailable", 503, status.STATUS_503_MESSAGE],
    ])(
      "receives a request that generates a known proxy error (%s)",

      (errorMsg, errorCode, statusMessage) => {
        beforeEach(async () => {
          factoryInstance = new ConcreteBaseProxyErrorClass();
          ({ req: mockReq, res: mockRes } = createAPIMocks({
            url: factoryInstance.route,
            method,
          }));
          factoryInstance.errorCode = errorCode;
          await factoryInstance.createHandler()(mockReq, mockRes);
        });

        it(`should return a ${errorCode}`, () => {
          expect(mockRes._getStatusCode()).toBe(errorCode);
          expect(mockRes._getJSONData()).toStrictEqual(statusMessage);
        });

        checkNoRetryHeader();
        checkTimeoutCleared();
        checkLogger();
      }
    );

    describe("when a request times out", () => {
      beforeEach(async () => {
        factoryInstance = new ConcreteBaseEndpointTimeoutErrorClass();
        ({ req: mockReq, res: mockRes } = createAPIMocks({
          url: factoryInstance.route,
          method,
        }));
        await factoryInstance.createHandler()(mockReq, mockRes);
      });

      it("should return a 503", () => {
        expect(mockRes._getStatusCode()).toBe(503);
        expect(mockRes._getJSONData()).toStrictEqual(status.STATUS_503_MESSAGE);
      });

      checkRetryHeader();
      checkTimeoutNotCleared();
      checkLogger();
    });

    describe("when a request uses the wrong method", () => {
      beforeEach(async () => {
        factoryInstance = new ConcreteBaseEndpointTimeoutErrorClass();
        ({ req: mockReq, res: mockRes } = createAPIMocks({
          url: factoryInstance.route,
          method: "POST",
        }));
        await factoryInstance.createHandler()(mockReq, mockRes);
      });

      it("should return a 405", () => {
        expect(mockRes._getStatusCode()).toBe(405);
        expect(mockRes._getJSONData()).toStrictEqual(status.STATUS_405_MESSAGE);
      });

      checkNoRetryHeader();
      checkTimeoutNotCleared();
      checkLogger();
    });
  });
});
