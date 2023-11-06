import ConcreteNextMiddleware from "./implementations/concrete.next.middleware.class";
import ConcreteResponseMiddleware from "./implementations/concrete.response.middleware.class";
import ConcreteSkipMiddleware from "./implementations/concrete.skip.middleware.class";
import RouteHandlerMiddleWareStack from "../handler.middleware.stack.class";
import * as status from "@src/config/status";
import { createAPIMocks } from "@src/vendors/integrations/api.framework/fixtures";
import type { HttpApiClientHttpMethodType } from "@src/contracts/api/types/clients/http.client.types";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type {
  MockAPIEndpointRequestType,
  MockAPIEndpointResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.fixture.types";
import type { ApiHandlerVendorRequestHandlerType } from "@src/vendors/types/integrations/api.handler/vendor.backend.types";

describe(RouteHandlerMiddleWareStack.name, () => {
  let instance: RouteHandlerMiddleWareStack;

  let mockReq: MockAPIEndpointRequestType;
  let mockRes: MockAPIEndpointResponseType & { mockCalls: string[] };
  let method: HttpApiClientHttpMethodType;

  const mockUrl = "https://mock.com/some/url";
  const mockResponse = { detail: "Created" };

  async function mockHandler(
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType,
    next: () => Promise<void>
  ): Promise<void> {
    (
      res as ApiFrameworkVendorApiResponseType & { mockCalls: string[] }
    ).mockCalls.push(mockHandler.name);
    res.status(201).json(mockResponse);
    await next();
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createInstance = () => (instance = new RouteHandlerMiddleWareStack());

  const createMocks = () => {
    ({ req: mockReq, res: mockRes as MockAPIEndpointResponseType } =
      createAPIMocks({
        url: mockUrl,
        method,
      }));
    mockRes.mockCalls = [];
  };

  const checkStackCalls = (expectedStack: string[]) => {
    it("should call the configured middleware and handlers in the right sequence", () => {
      expect(mockRes.mockCalls).toStrictEqual(expectedStack);
    });
  };

  const checkResponse = (code: number, response: Record<string, unknown>) => {
    it("should return the expected response", () => {
      expect(mockRes._getStatusCode()).toBe(code);
      expect(mockRes._getJSONData()).toStrictEqual(response);
    });
  };

  describe("createHandler", () => {
    let handler: ApiHandlerVendorRequestHandlerType;

    describe("scenario 1: (GET handler with no middleware)", () => {
      beforeEach(() => {
        createInstance();
        handler = instance.createHandler("GET", mockHandler);
      });

      describe("with a GET request", () => {
        beforeEach(async () => {
          method = "GET";
          createMocks();

          await handler(mockReq, mockRes);
        });

        checkStackCalls([mockHandler.name]);
        checkResponse(201, mockResponse);
      });
    });

    describe("scenario 2: (GET handler with before only)", () => {
      beforeEach(() => {
        createInstance();
        instance.useBefore(new ConcreteNextMiddleware());
        handler = instance.createHandler("GET", mockHandler);
      });

      describe("with a GET request", () => {
        beforeEach(async () => {
          method = "GET";
          createMocks();

          await handler(mockReq, mockRes);
        });

        checkStackCalls([ConcreteNextMiddleware.name, mockHandler.name]);
        checkResponse(201, mockResponse);
      });
    });

    describe("scenario 3: (GET handler with after only)", () => {
      beforeEach(() => {
        createInstance();
        instance.useAfter(new ConcreteNextMiddleware());
        handler = instance.createHandler("GET", mockHandler);
      });

      describe("with a GET request", () => {
        beforeEach(async () => {
          method = "GET";
          createMocks();

          await handler(mockReq, mockRes);
        });

        checkStackCalls([mockHandler.name, ConcreteNextMiddleware.name]);
        checkResponse(201, mockResponse);
      });
    });

    describe("scenario 4: (GET handler with before and after middleware)", () => {
      beforeEach(() => {
        createInstance();
        instance.useBefore(new ConcreteNextMiddleware());
        instance.useAfter(new ConcreteNextMiddleware());
        handler = instance.createHandler("GET", mockHandler);
      });

      describe("with a GET request", () => {
        beforeEach(async () => {
          method = "GET";
          createMocks();

          await handler(mockReq, mockRes);
        });

        checkStackCalls([
          ConcreteNextMiddleware.name,
          mockHandler.name,
          ConcreteNextMiddleware.name,
        ]);
        checkResponse(201, mockResponse);
      });
    });

    describe("scenario 5: (GET handler with multiple before and after middleware)", () => {
      beforeEach(() => {
        createInstance();
        instance.useBefore(new ConcreteNextMiddleware());
        instance.useBefore(new ConcreteNextMiddleware());
        instance.useAfter(new ConcreteNextMiddleware());
        instance.useAfter(new ConcreteNextMiddleware());
        handler = instance.createHandler("GET", mockHandler);
      });

      describe("with a GET request", () => {
        beforeEach(async () => {
          method = "GET";
          createMocks();

          await handler(mockReq, mockRes);
        });

        checkStackCalls([
          ConcreteNextMiddleware.name,
          ConcreteNextMiddleware.name,
          mockHandler.name,
          ConcreteNextMiddleware.name,
          ConcreteNextMiddleware.name,
        ]);
        checkResponse(201, mockResponse);
      });
    });

    describe("scenario 5: (GET handler with a skipped before middleware and after middleware)", () => {
      beforeEach(() => {
        createInstance();
        instance.useBefore(new ConcreteNextMiddleware());
        instance.useBefore(new ConcreteResponseMiddleware());
        instance.useBefore(new ConcreteSkipMiddleware());
        instance.useBefore(new ConcreteNextMiddleware());
        instance.useAfter(new ConcreteNextMiddleware());
        instance.useAfter(new ConcreteNextMiddleware());
        handler = instance.createHandler("GET", mockHandler);
      });

      describe("with a GET request", () => {
        beforeEach(async () => {
          method = "GET";
          createMocks();

          await handler(mockReq, mockRes);
        });

        checkStackCalls([
          ConcreteNextMiddleware.name,
          ConcreteResponseMiddleware.name,
          ConcreteSkipMiddleware.name,
          ConcreteNextMiddleware.name,
          ConcreteNextMiddleware.name,
        ]);
        checkResponse(400, status.STATUS_400_MESSAGE);
      });
    });

    describe("scenario 6: (GET handler with before middleware and a skipped after middleware)", () => {
      beforeEach(() => {
        createInstance();
        instance.useBefore(new ConcreteNextMiddleware());
        instance.useBefore(new ConcreteNextMiddleware());
        instance.useAfter(new ConcreteNextMiddleware());
        instance.useAfter(new ConcreteSkipMiddleware());
        instance.useAfter(new ConcreteResponseMiddleware());
        handler = instance.createHandler("GET", mockHandler);
      });

      describe("with a GET request", () => {
        beforeEach(async () => {
          method = "GET";
          createMocks();

          await handler(mockReq, mockRes);
        });

        checkStackCalls([
          ConcreteNextMiddleware.name,
          ConcreteNextMiddleware.name,
          mockHandler.name,
          ConcreteNextMiddleware.name,
          ConcreteSkipMiddleware.name,
        ]);

        checkResponse(201, mockResponse);
      });
    });

    describe("scenario 7: (GET handler with before middleware before and after)", () => {
      beforeEach(() => {
        createInstance();
        instance.useBefore(new ConcreteNextMiddleware());
        instance.useAfter(new ConcreteNextMiddleware());
        handler = instance.createHandler("GET", mockHandler);
      });

      describe("with a POST request", () => {
        beforeEach(() => {
          method = "POST";
          createMocks();

          handler(mockReq, mockRes);
        });

        checkStackCalls([ConcreteNextMiddleware.name]);
        checkResponse(405, status.STATUS_405_MESSAGE);
      });
    });
  });
});
