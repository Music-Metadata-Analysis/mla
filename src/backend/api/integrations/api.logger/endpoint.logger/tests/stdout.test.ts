import StdOutLogger from "../stdout";
import apiRoutes from "@src/config/apiRoutes";
import { createAPIMocks } from "@src/tests/fixtures/mock.authentication";
import type { MockAPIRequestType } from "@src/backend/api/types/services/request.types";
import type { MockAPIResponseType } from "@src/backend/api/types/services/response.types";

describe("StdOutLogger", () => {
  let consoleLogSpy: jest.SpyInstance;
  let currentProps: {
    body: { [key: string]: string };
    bytesRead: string;
    method: "GET";
    referer: string;
    proxyResponse?: string;
    remoteAddress?: string | string[];
    socketDefinedRemoteAddress?: string;
    statusCode: number;
    url: string;
    userAgent: string;
    next: () => void;
  };

  let instance: StdOutLogger;

  let mockReq: MockAPIRequestType;
  let mockRes: MockAPIResponseType;

  const baseProps = {
    body: { test: "test body " },
    bytesRead: "300",
    method: "GET" as const,
    referer: "referred by someone",
    proxyResponse: "Success!",
    statusCode: 200,
    socketDefinedRemoteAddress: "8.8.8.8",
    url: apiRoutes.v1.reports.lastfm.top20artists,
    userAgent: "test user agent",
    next: jest.fn(),
  };

  const defaultProxyResponse = "No Response";

  beforeAll(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => null);
  });

  afterAll(() => {
    consoleLogSpy.mockReset();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrangeMocks = () => {
    ({ req: mockReq, res: mockRes } = createAPIMocks({
      headers: {
        referer: currentProps.referer,
        "user-agent": currentProps.userAgent,
        "content-length": currentProps.bytesRead,
        "x-forwarded-for": currentProps.remoteAddress,
      },
      socket: { remoteAddress: currentProps.socketDefinedRemoteAddress },
      url: currentProps.url,
      method: currentProps.method,
      body: currentProps.body,
      proxyResponse: currentProps.proxyResponse,
    }));
  };

  const actLog = () => {
    instance = new StdOutLogger();
    instance.log(mockReq, mockRes, currentProps.next);
    mockRes.status(currentProps.statusCode).json({ status: "ready" });
  };

  const resetProps = () => {
    currentProps = { ...baseProps };
  };

  const checkLogMessage = (socketAddress: string, proxyResponseMsg: string) => {
    let expected_log_message = socketAddress + " ";
    expected_log_message += currentProps.method + " ";
    expected_log_message += currentProps.url + " ";
    expected_log_message += currentProps.statusCode + " ";
    expected_log_message += currentProps.bytesRead + " ";
    expected_log_message += currentProps.referer + " ";
    expected_log_message += currentProps.userAgent + " ";
    expected_log_message += `(LastFM Service: ${proxyResponseMsg})`;
    expect(console.log).toBeCalledTimes(1);
    expect(console.log).toBeCalledWith(expected_log_message);
  };

  const checkNextCalled = () => {
    it("should call the 'next' function", () => {
      expect(currentProps.next).toBeCalledTimes(1);
      expect(currentProps.next).toBeCalledWith();
    });
  };

  describe("with a string based list of ips as the x-forwarded-header", () => {
    beforeEach(() => {
      currentProps.remoteAddress = "127.0.0.1,192.168.0.1";
    });

    describe("with a proxy response message", () => {
      beforeEach(() => {
        currentProps.proxyResponse = "Success!";
      });

      describe("with a socket remote address defined", () => {
        beforeEach(() => {
          currentProps.socketDefinedRemoteAddress = "8.8.8.8";
        });

        describe("when given a mock request and 200 response", () => {
          beforeEach(() => {
            currentProps.statusCode = 200;
            arrangeMocks();

            actLog();
          });

          it("should log the expected message, using the socket's remote address", () => {
            checkLogMessage(
              currentProps.socketDefinedRemoteAddress as string,
              currentProps.proxyResponse as string
            );
          });

          checkNextCalled();
        });
      });

      describe("with NO socket remote address defined", () => {
        beforeEach(() => {
          currentProps.socketDefinedRemoteAddress = undefined;
        });

        describe("when given a mock request and 200 response", () => {
          beforeEach(() => {
            currentProps.statusCode = 200;
            arrangeMocks();

            actLog();
          });

          it("should log the expected message, using the first x-forwarded header's address", () => {
            checkLogMessage(
              (currentProps.remoteAddress as string).split(",")[0],
              currentProps.proxyResponse as string
            );
          });

          checkNextCalled();
        });
      });
    });

    describe("without a proxy response message", () => {
      beforeEach(() => {
        currentProps.proxyResponse = undefined;
      });

      describe("with a socket remote address defined", () => {
        beforeEach(() => {
          currentProps.socketDefinedRemoteAddress = "8.8.8.8";
        });

        describe("when given a mock request and 200 response", () => {
          beforeEach(() => {
            currentProps.statusCode = 200;
            arrangeMocks();

            actLog();
          });

          it("should log the expected message, using the socket's remote address", () => {
            checkLogMessage(
              currentProps.socketDefinedRemoteAddress as string,
              defaultProxyResponse
            );
          });

          checkNextCalled();
        });
      });

      describe("with NO socket remote address defined", () => {
        beforeEach(() => {
          currentProps.socketDefinedRemoteAddress = undefined;
        });

        describe("when given a mock request and 200 response", () => {
          beforeEach(() => {
            currentProps.statusCode = 200;
            arrangeMocks();

            actLog();
          });

          it("should log the expected message, using the first x-forwarded header's address", () => {
            checkLogMessage(
              (currentProps.remoteAddress as string).split(",")[0],
              defaultProxyResponse
            );
          });

          checkNextCalled();
        });
      });
    });
  });

  describe("with an array based list of ips as the x-forwarded-header", () => {
    beforeEach(() => {
      currentProps.remoteAddress = ["127.0.0.1", "192.168.0.1"];
    });

    describe("with a proxy response message", () => {
      beforeEach(() => {
        currentProps.proxyResponse = "Success!";
      });

      describe("with a socket remote address defined", () => {
        beforeEach(() => {
          currentProps.socketDefinedRemoteAddress = "8.8.8.8";
        });

        describe("when given a mock request and 200 response", () => {
          beforeEach(() => {
            currentProps.statusCode = 200;
            arrangeMocks();

            actLog();
          });

          it("should log the expected message, using the socket's remote address", () => {
            checkLogMessage(
              currentProps.socketDefinedRemoteAddress as string,
              currentProps.proxyResponse as string
            );
          });

          checkNextCalled();
        });
      });

      describe("with NO socket remote address defined", () => {
        beforeEach(() => {
          currentProps.socketDefinedRemoteAddress = undefined;
        });

        describe("when given a mock request and 200 response", () => {
          beforeEach(() => {
            currentProps.statusCode = 200;
            arrangeMocks();

            actLog();
          });

          it("should log the expected message, using the first x-forwarded header's address", () => {
            checkLogMessage(
              (currentProps.remoteAddress as Array<string>)[0],
              currentProps.proxyResponse as string
            );
          });

          checkNextCalled();
        });
      });
    });

    describe("without a proxy response message", () => {
      beforeEach(() => {
        currentProps.proxyResponse = undefined;
      });

      describe("with a socket remote address defined", () => {
        beforeEach(() => {
          currentProps.socketDefinedRemoteAddress = "8.8.8.8";
        });

        describe("when given a mock request and 200 response", () => {
          beforeEach(() => {
            currentProps.statusCode = 200;
            arrangeMocks();

            actLog();
          });

          it("should log the expected message, using the socket's remote address", () => {
            checkLogMessage(
              currentProps.socketDefinedRemoteAddress as string,
              defaultProxyResponse
            );
          });

          checkNextCalled();
        });
      });

      describe("with NO socket remote address defined", () => {
        beforeEach(() => {
          currentProps.socketDefinedRemoteAddress = undefined;
        });

        describe("when given a mock request and 200 response", () => {
          beforeEach(() => {
            currentProps.statusCode = 200;
            arrangeMocks();

            actLog();
          });

          it("should log the expected message, using the first x-forwarded header's address", () => {
            checkLogMessage(
              (currentProps.remoteAddress as Array<string>)[0],
              defaultProxyResponse
            );
          });

          checkNextCalled();
        });
      });
    });
  });

  describe("with an undefined x-forwarded-header", () => {
    beforeEach(() => {
      currentProps.remoteAddress = undefined;
    });

    describe("with a proxy response message", () => {
      beforeEach(() => {
        currentProps.proxyResponse = "Success!";
      });

      describe("with a socket remote address defined", () => {
        beforeEach(() => {
          currentProps.socketDefinedRemoteAddress = "8.8.8.8";
        });

        describe("when given a mock request and 200 response", () => {
          beforeEach(() => {
            currentProps.statusCode = 200;
            arrangeMocks();

            actLog();
          });

          it("should log the expected message, using the socket's remote address", () => {
            checkLogMessage(
              currentProps.socketDefinedRemoteAddress as string,
              currentProps.proxyResponse as string
            );
          });

          checkNextCalled();
        });
      });

      describe("with NO socket remote address defined", () => {
        beforeEach(() => {
          currentProps.socketDefinedRemoteAddress = undefined;
        });

        describe("when given a mock request and 200 response", () => {
          beforeEach(() => {
            currentProps.statusCode = 200;
            arrangeMocks();

            actLog();
          });

          it("should log the expected message, using the first x-forwarded header's address", () => {
            checkLogMessage("?.?.?.?", currentProps.proxyResponse as string);
          });

          checkNextCalled();
        });
      });
    });

    describe("without a proxy response message", () => {
      beforeEach(() => {
        currentProps.proxyResponse = undefined;
      });

      describe("with a socket remote address defined", () => {
        beforeEach(() => {
          currentProps.socketDefinedRemoteAddress = "8.8.8.8";
        });

        describe("when given a mock request and 200 response", () => {
          beforeEach(() => {
            currentProps.statusCode = 200;
            arrangeMocks();

            actLog();
          });

          it("should log the expected message, using the socket's remote address", () => {
            checkLogMessage(
              currentProps.socketDefinedRemoteAddress as string,
              defaultProxyResponse
            );
          });

          checkNextCalled();
        });
      });

      describe("with NO socket remote address defined", () => {
        beforeEach(() => {
          currentProps.socketDefinedRemoteAddress = undefined;
        });

        describe("when given a mock request and 200 response", () => {
          beforeEach(() => {
            currentProps.statusCode = 200;
            arrangeMocks();

            actLog();
          });

          it("should log the expected message, using the first x-forwarded header's address", () => {
            checkLogMessage("?.?.?.?", defaultProxyResponse);
          });

          checkNextCalled();
        });
      });
    });
  });
});
