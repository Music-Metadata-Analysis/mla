import ReportCacheCreateEndpointFactoryV2 from "../methods/v2.report.cache.create.endpoint.factory.class";
import ReportCacheRetrieveEndpointFactoryV2 from "../methods/v2.report.cache.retrieve.endpoint.factory.class";
import apiRoutes from "@src/config/apiRoutes";
import * as status from "@src/config/status";
import { createAPIMocks } from "@src/vendors/integrations/api.framework/fixtures";
import { mockEndpointLogger } from "@src/vendors/integrations/api.logger/__mocks__/vendor.backend.mock";
import type APIRouterBase from "@src/api/services/generics/endpoints/generic.router.base.class";
import type { HttpApiClientHttpMethodType } from "@src/contracts/api/types/clients/http.client.types";
import type {
  MockAPIEndpointRequestType,
  MockAPIEndpointResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.fixture.types";
import type { ApiHandlerVendorRequestHandlerType } from "@src/vendors/types/integrations/api.handler/vendor.backend.types";

jest.mock("@src/vendors/integrations/api.logger/vendor.backend");

describe("ReportCacheEndpointRouter", () => {
  let mockReq: MockAPIEndpointRequestType;
  let mockRes: MockAPIEndpointResponseType;

  let method: HttpApiClientHttpMethodType;

  let factoryInstance: APIRouterBase;

  let ReportCacheEndpointRouter: new () => APIRouterBase;
  let createHandler: ApiHandlerVendorRequestHandlerType;
  let retrieveHandler: ApiHandlerVendorRequestHandlerType;

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(ReportCacheCreateEndpointFactoryV2.prototype, "createHandler")
      .mockReturnValue(jest.fn());
    jest
      .spyOn(ReportCacheRetrieveEndpointFactoryV2.prototype, "createHandler")
      .mockReturnValue(jest.fn());
  });

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

  const createInstance = () => {
    ({
      default: ReportCacheEndpointRouter,
      createHandler,
      retrieveHandler,
    } = require("../v2.report.cache.router.factory.class"));
    factoryInstance = new ReportCacheEndpointRouter();
  };

  const arrange = async () => {
    ({ req: mockReq, res: mockRes } = createAPIMocks({
      url: factoryInstance.route,
      method,
    }));

    await factoryInstance.createHandler()(mockReq, mockRes);
  };

  describe("when initialized", () => {
    beforeEach(() => createInstance());

    it("should have the expected configured route attribute", () => {
      expect(factoryInstance.route).toBe(apiRoutes.v2.cache);
    });

    it("should have the expected configured service attribute", () => {
      expect(factoryInstance.service).toBe("Report Cache");
    });

    describe("when the handler receives a request", () => {
      describe("with a known invalid method (PUT)", () => {
        beforeEach(() => {
          method = "PUT";

          arrange();
        });

        it("should return a 405", () => {
          expect(mockRes._getStatusCode()).toBe(405);
          expect(mockRes._getJSONData()).toStrictEqual(
            status.STATUS_405_MESSAGE
          );
        });

        it("should NOT call the createHandler", () => {
          expect(createHandler).toHaveBeenCalledTimes(0);
        });

        it("should NOT call the retrieveHandler", () => {
          expect(retrieveHandler).toHaveBeenCalledTimes(0);
        });

        checkLogger();
      });

      describe("with a known invalid method (GET)", () => {
        beforeEach(() => {
          method = "GET";

          arrange();
        });

        it("should NOT call the createHandler", () => {
          expect(createHandler).toHaveBeenCalledTimes(0);
        });

        it("should call the retrieveHandler", () => {
          expect(retrieveHandler).toHaveBeenCalledTimes(1);
          expect(retrieveHandler).toHaveBeenCalledWith(mockReq, mockRes);
        });

        checkNoLogger();
      });

      describe("with a known invalid method (POST)", () => {
        beforeEach(() => {
          method = "POST";

          arrange();
        });

        it("should call the createHandler", () => {
          expect(createHandler).toHaveBeenCalledTimes(1);
          expect(createHandler).toHaveBeenCalledWith(mockReq, mockRes);
        });

        it("should NOT call the retrieveHandler", () => {
          expect(retrieveHandler).toHaveBeenCalledTimes(0);
        });

        checkNoLogger();
      });
    });
  });
});
