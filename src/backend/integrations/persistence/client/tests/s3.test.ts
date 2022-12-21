import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import S3PersistenceClient from "../s3";
import type { PersistenceVendorClientHeadersInterface } from "@src/types/integrations/persistence/vendor.types";

jest.mock("@aws-sdk/client-s3");

const MockedS3Client = jest.mocked(S3Client);
const MockedPutObjectCommand = jest.mocked(PutObjectCommand);

describe(S3PersistenceClient.name, () => {
  let instance: S3PersistenceClient;
  let mockHeaders: PersistenceVendorClientHeadersInterface;
  let originalEnvironment: typeof process.env;

  const mockKeyName = "mockKeyName";
  const mockStringData = "mockStringData";
  const mockObjectData = { mockKey: "mockValue" };

  const expectedStringCommand = {
    Body: mockStringData,
    Bucket: "MockValue4",
    Key: mockKeyName,
  };
  const expectedObjectCommand = {
    Body: JSON.stringify(mockObjectData),
    Bucket: "MockValue4",
    Key: mockKeyName,
  };

  beforeAll(() => {
    originalEnvironment = process.env;
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    setupEnv();
  });

  const setupEnv = () => {
    process.env.MLA_AWS_ACCESS_KEY_ID = "MockValue1";
    process.env.MLA_AWS_SECRET_ACCESS_KEY = "MockValue2";
    process.env.MLA_AWS_REGION = "MockValue3";
    process.env.AUTH_EMAILS_BUCKET_NAME = "MockValue4";
  };

  const arrange = () => {
    instance = new S3PersistenceClient(process.env.AUTH_EMAILS_BUCKET_NAME);
  };

  describe("when initialized", () => {
    beforeEach(() => {
      arrange();
    });

    it("should instantiate S3Client correctly", () => {
      expect(MockedS3Client).toBeCalledTimes(1);
      expect(MockedS3Client).toBeCalledWith({
        credentials: {
          accessKeyId: "MockValue1",
          secretAccessKey: "MockValue2",
        },
        region: "MockValue3",
      });
    });

    describe("write", () => {
      describe("with string data", () => {
        describe("with CacheControl headers", () => {
          beforeEach(async () => {
            mockHeaders = {
              ContentType: "application/json",
              CacheControl: "max-age=3600",
            };
            await instance.write(mockKeyName, mockStringData, mockHeaders);
          });

          it("should create the expected PutObjectCommand", () => {
            expect(MockedPutObjectCommand).toBeCalledTimes(1);
            expect(MockedPutObjectCommand).toBeCalledWith({
              ...expectedStringCommand,
              ...mockHeaders,
            });
          });

          it("should send the PutObjectCommand to S3", () => {
            expect(MockedS3Client.mock.instances[0].send).toBeCalledTimes(1);
            expect(MockedS3Client.mock.instances[0].send).toBeCalledWith(
              MockedPutObjectCommand.mock.instances[0]
            );
          });
        });

        describe("with NO CacheControl headers", () => {
          beforeEach(async () => {
            mockHeaders = {
              ContentType: "application/json",
            };
            await instance.write(mockKeyName, mockStringData, mockHeaders);
          });

          it("should create the expected PutObjectCommand", () => {
            expect(MockedPutObjectCommand).toBeCalledTimes(1);
            expect(MockedPutObjectCommand).toBeCalledWith({
              ...expectedStringCommand,
              ...mockHeaders,
            });
          });

          it("should send the PutObjectCommand to S3", () => {
            expect(MockedS3Client.mock.instances[0].send).toBeCalledTimes(1);
            expect(MockedS3Client.mock.instances[0].send).toBeCalledWith(
              MockedPutObjectCommand.mock.instances[0]
            );
          });
        });
      });

      describe("with object data", () => {
        describe("with CacheControl headers", () => {
          beforeEach(async () => {
            mockHeaders = {
              ContentType: "application/json",
              CacheControl: "max-age=3600",
            };
            await instance.write(mockKeyName, mockObjectData, mockHeaders);
          });

          it("should create the expected PutObjectCommand", () => {
            expect(MockedPutObjectCommand).toBeCalledTimes(1);
            expect(MockedPutObjectCommand).toBeCalledWith({
              ...expectedObjectCommand,
              ...mockHeaders,
            });
          });

          it("should send the PutObjectCommand to S3", () => {
            expect(MockedS3Client.mock.instances[0].send).toBeCalledTimes(1);
            expect(MockedS3Client.mock.instances[0].send).toBeCalledWith(
              MockedPutObjectCommand.mock.instances[0]
            );
          });
        });

        describe("with NO CacheControl headers", () => {
          beforeEach(async () => {
            mockHeaders = {
              ContentType: "application/json",
            };
            await instance.write(mockKeyName, mockObjectData, mockHeaders);
          });

          it("should create the expected PutObjectCommand", () => {
            expect(MockedPutObjectCommand).toBeCalledTimes(1);
            expect(MockedPutObjectCommand).toBeCalledWith({
              ...expectedObjectCommand,
              ...mockHeaders,
            });
          });

          it("should send the PutObjectCommand to S3", () => {
            expect(MockedS3Client.mock.instances[0].send).toBeCalledTimes(1);
            expect(MockedS3Client.mock.instances[0].send).toBeCalledWith(
              MockedPutObjectCommand.mock.instances[0]
            );
          });
        });
      });
    });
  });
});
