import ConcreteApiRouter, {
  mockPostHandler,
  mockPutHandler,
} from "./implementations/concrete.router.class";
import APIRouterBase from "../generic.router.base.class";
import * as status from "@src/config/status";
import { createAPIMocks } from "@src/vendors/integrations/api.framework/fixtures";
import { mockEndpointLogger } from "@src/vendors/integrations/api.logger/__mocks__/vendor.backend.mock";
import type { HttpApiClientHttpMethodType } from "@src/contracts/api/types/clients/http.client.types";
import type {
  MockAPIEndpointRequestType,
  MockAPIEndpointResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.fixture.types";

jest.mock("@src/vendors/integrations/api.logger/vendor.backend");

describe(APIRouterBase.name, () => {
  let factoryInstance: APIRouterBase;

  let mockReq: MockAPIEndpointRequestType;
  let mockRes: MockAPIEndpointResponseType;

  let method: HttpApiClientHttpMethodType;

  beforeEach(() => jest.clearAllMocks());

  const checkLogger = () => {
    it("should log a message", () => {
      expect(mockEndpointLogger).toHaveBeenCalledTimes(1);

      const call = jest.mocked(mockEndpointLogger).mock.calls[0];
      expect(call[0]).toBe(mockReq);
      expect(call[1]).toBe(mockRes);
      expect(call.length).toBe(2);
    });
  };

  const checkNoLogger = () => {
    it("should NOT log a message", () => {
      expect(mockEndpointLogger).toHaveBeenCalledTimes(0);
    });
  };

  const arrange = async () => {
    ({ req: mockReq, res: mockRes } = createAPIMocks({
      url: factoryInstance.route,
      method,
    }));
    await factoryInstance.createHandler()(mockReq, mockRes);
  };

  describe("when initialized", () => {
    describe("with a concrete implementation", () => {
      beforeEach(() => (factoryInstance = new ConcreteApiRouter()));

      describe("with a known invalid method (GET)", () => {
        beforeEach(() => {
          method = "GET";

          arrange();
        });

        it("should return a 405", () => {
          expect(mockRes._getStatusCode()).toBe(405);
          expect(mockRes._getJSONData()).toStrictEqual(
            status.STATUS_405_MESSAGE
          );
        });

        it("should NOT call the POST handler", () => {
          expect(mockPostHandler).toHaveBeenCalledTimes(0);
        });

        it("should NOT call the PUT handler", () => {
          expect(mockPutHandler).toHaveBeenCalledTimes(0);
        });

        checkLogger();
      });

      describe("with a known valid method (POST)", () => {
        beforeEach(() => {
          method = "POST";

          arrange();
        });

        it("should return a 301", () => {
          expect(mockRes._getStatusCode()).toBe(301);
        });

        it("should call the POST handler", () => {
          expect(mockPostHandler).toHaveBeenCalledTimes(1);
          expect(mockPostHandler).toHaveBeenCalledWith(mockReq, mockRes);
        });

        it("should NOT call the PUT handler", () => {
          expect(mockPutHandler).toHaveBeenCalledTimes(0);
        });

        checkNoLogger();
      });

      describe("with a known valid method (PUT)", () => {
        beforeEach(() => {
          method = "PUT";

          arrange();
        });

        it("should return a 302", () => {
          expect(mockRes._getStatusCode()).toBe(302);
        });

        it("should NOT call the POST handler", () => {
          expect(mockPostHandler).toHaveBeenCalledTimes(0);
        });

        it("should call the PUT handler", () => {
          expect(mockPutHandler).toHaveBeenCalledTimes(1);
          expect(mockPutHandler).toHaveBeenCalledWith(mockReq, mockRes);
        });

        checkNoLogger();
      });
    });
  });
});
