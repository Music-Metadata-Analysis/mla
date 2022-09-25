import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import S3PersistenceClient from "../s3";
import type { PersistanceClientHeaders } from "@src/types/integrations/persistance/vendor.types";

jest.mock("@aws-sdk/client-s3", () => {
  return {
    S3Client: jest.fn(() => MockS3Client),
    PutObjectCommand: jest.fn(() => MockBucketCommand),
  };
});

const MockS3Client = {
  send: jest.fn(async () => null),
};

const MockBucketCommand = { MockCommand: "MockCommand" };

describe(S3PersistenceClient.name, () => {
  let instance: S3PersistenceClient;
  let mockHeaders: PersistanceClientHeaders;
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

  afterAll(() => jest.restoreAllMocks());

  beforeEach(() => {
    jest.clearAllMocks();
    setupEnv();
  });

  afterAll(() => {
    process.env = originalEnvironment;
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
      expect(S3Client).toBeCalledTimes(1);
      expect(S3Client).toBeCalledWith({
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
            expect(PutObjectCommand).toBeCalledTimes(1);
            expect(PutObjectCommand).toBeCalledWith({
              ...expectedStringCommand,
              ...mockHeaders,
            });
          });

          it("should send the PutObjectCommand to S3", () => {
            expect(MockS3Client.send).toBeCalledTimes(1);
            expect(MockS3Client.send).toBeCalledWith(MockBucketCommand);
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
            expect(PutObjectCommand).toBeCalledTimes(1);
            expect(PutObjectCommand).toBeCalledWith({
              ...expectedStringCommand,
              ...mockHeaders,
            });
          });

          it("should send the PutObjectCommand to S3", () => {
            expect(MockS3Client.send).toBeCalledTimes(1);
            expect(MockS3Client.send).toBeCalledWith(MockBucketCommand);
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
            expect(PutObjectCommand).toBeCalledTimes(1);
            expect(PutObjectCommand).toBeCalledWith({
              ...expectedObjectCommand,
              ...mockHeaders,
            });
          });

          it("should send the PutObjectCommand to S3", () => {
            expect(MockS3Client.send).toBeCalledTimes(1);
            expect(MockS3Client.send).toBeCalledWith(MockBucketCommand);
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
            expect(PutObjectCommand).toBeCalledTimes(1);
            expect(PutObjectCommand).toBeCalledWith({
              ...expectedObjectCommand,
              ...mockHeaders,
            });
          });

          it("should send the PutObjectCommand to S3", () => {
            expect(MockS3Client.send).toBeCalledTimes(1);
            expect(MockS3Client.send).toBeCalledWith(MockBucketCommand);
          });
        });
      });
    });
  });
});
