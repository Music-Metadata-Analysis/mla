import { createMocks, MockRequest, MockResponse } from "node-mocks-http";
import apiRoutes from "../../../../config/apiRoutes";
import Logger from "../endpoint.common.logger";
import type { LastFMEndpointRequest } from "../../../../types/api.endpoint.types";
import type { NextApiResponse, NextApiRequest } from "next";

describe("endpointLogger", () => {
  // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
  let req: MockRequest<LastFMEndpointRequest>;
  // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
  let res: MockResponse<NextApiResponse>;
  const next = jest.fn();
  let testRemoteAddress: string | string[] | undefined;
  const testBody = { test: "test body" };
  const testBytesRead = "300";
  const testMethod = "GET";
  const testProxyResponse = "Success!";
  const testReferer = "referred by someone";
  const testURL = apiRoutes.v1.reports.lastfm.top20artists;
  const testUserAgent = "test user agent";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementationOnce(() => jest.fn());
  });

  const arrange = async (socketDefinedRemoteAddress?: string) => {
    // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
    ({ req: req, res: res } = createMocks<NextApiRequest, NextApiResponse>({
      headers: {
        referer: testReferer,
        "user-agent": testUserAgent,
        "content-length": testBytesRead,
        "x-forwarded-for": testRemoteAddress,
      },
      socket: { remoteAddress: socketDefinedRemoteAddress },
      url: testURL,
      method: testMethod,
      body: testBody,
      proxyResponse: testProxyResponse,
    }));
    await Logger(req, res, next);
  };

  describe("with a string based list of ips as the x-forwarded-header", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      testRemoteAddress = "127.0.0.1,192.168.0.1";
    });

    describe("with a socket remote address defined", () => {
      const socketTestAddress = "8.8.8.8";

      describe("when given a mock request and 200 response", () => {
        const statusCode = 200;

        beforeEach(async () => {
          await arrange(socketTestAddress);
          res.status(statusCode).json({ status: "ready" });
        });

        it("should log the expected message, using the socket's remote address", () => {
          const expected_log_message = `${socketTestAddress} ${testMethod} ${testURL} ${statusCode} ${testBytesRead} ${testReferer} ${testUserAgent} (LastFM Service: ${testProxyResponse})`;
          expect(console.log).toBeCalledTimes(1);
          expect(console.log).toBeCalledWith(expected_log_message);
        });
      });
    });

    describe("with NOT socket remote address defined", () => {
      describe("when given a mock request and 200 response", () => {
        const statusCode = 200;

        beforeEach(async () => {
          await arrange();
          res.status(statusCode).json({ status: "ready" });
        });

        it("should log the expected message, using the first x-forwarded header's address", () => {
          const expected_log_message = `${
            (testRemoteAddress as string).split(",")[0]
          } ${testMethod} ${testURL} ${statusCode} ${testBytesRead} ${testReferer} ${testUserAgent} (LastFM Service: ${testProxyResponse})`;
          expect(console.log).toBeCalledTimes(1);
          expect(console.log).toBeCalledWith(expected_log_message);
        });
      });
    });
  });

  describe("with an array based list of ips as the x-forwarded-header", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      testRemoteAddress = ["127.0.0.1", "192.168.0.1"];
    });

    describe("with a socket remote address defined", () => {
      const socketTestAddress = "8.8.8.8";

      describe("when given a mock request and 200 response", () => {
        const statusCode = 200;

        beforeEach(async () => {
          await arrange(socketTestAddress);
          res.status(statusCode).json({ status: "ready" });
        });

        it("should log the expected message, using the socket's remote address", () => {
          const expected_log_message = `${socketTestAddress} ${testMethod} ${testURL} ${statusCode} ${testBytesRead} ${testReferer} ${testUserAgent} (LastFM Service: ${testProxyResponse})`;
          expect(console.log).toBeCalledTimes(1);
          expect(console.log).toBeCalledWith(expected_log_message);
        });
      });
    });

    describe("with NOT socket remote address defined", () => {
      describe("when given a mock request and 200 response", () => {
        const statusCode = 200;

        beforeEach(async () => {
          await arrange();
          res.status(statusCode).json({ status: "ready" });
        });

        it("should log the expected message, using the first x-forwarded header's address", () => {
          const expected_log_message = `${
            (testRemoteAddress as string[])[0]
          } ${testMethod} ${testURL} ${statusCode} ${testBytesRead} ${testReferer} ${testUserAgent} (LastFM Service: ${testProxyResponse})`;
          expect(console.log).toBeCalledTimes(1);
          expect(console.log).toBeCalledWith(expected_log_message);
        });
      });
    });
  });

  describe("with an undefined x-forwarded-header", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      testRemoteAddress = undefined;
    });

    describe("with a socket remote address defined", () => {
      const socketTestAddress = "8.8.8.8";

      describe("when given a mock request and 200 response", () => {
        const statusCode = 200;

        beforeEach(async () => {
          await arrange(socketTestAddress);
          res.status(statusCode).json({ status: "ready" });
        });

        it("should log the expected message, using the socket's remote address", () => {
          const expected_log_message = `${socketTestAddress} ${testMethod} ${testURL} ${statusCode} ${testBytesRead} ${testReferer} ${testUserAgent} (LastFM Service: ${testProxyResponse})`;
          expect(console.log).toBeCalledTimes(1);
          expect(console.log).toBeCalledWith(expected_log_message);
        });
      });
    });

    describe("with NOT socket remote address defined", () => {
      describe("when given a mock request and 200 response", () => {
        const statusCode = 200;

        beforeEach(async () => {
          await arrange();
          res.status(statusCode).json({ status: "ready" });
        });

        it("should log the expected message, simply stating undefined for the remote ip address", () => {
          const expected_log_message = `${undefined} ${testMethod} ${testURL} ${statusCode} ${testBytesRead} ${testReferer} ${testUserAgent} (LastFM Service: ${testProxyResponse})`;
          expect(console.log).toBeCalledTimes(1);
          expect(console.log).toBeCalledWith(expected_log_message);
        });
      });
    });
  });
});
