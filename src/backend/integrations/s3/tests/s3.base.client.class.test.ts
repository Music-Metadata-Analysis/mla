import { S3Client } from "@aws-sdk/client-s3";
import S3BaseClient from "../s3.base.client.class";

jest.mock("@aws-sdk/client-s3", () => {
  return {
    S3Client: jest.fn(() => MockS3Client),
  };
});

const MockS3Client = { send: "MockSendCommand" };

describe("S3BaseClient", () => {
  let instance: S3BaseClient;
  let originalEnvironment: typeof process.env;
  const mockBucketName = "mockBucket";

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
    process.env.LASTFM_CACHE_AWS_S3_BUCKET_NAME = "MockValue4";
    process.env.LASTFM_CACHE_AWS_CLOUDFRONT_DOMAIN_NAME = "MockValue5";
  };

  const arrange = () => {
    instance = new S3BaseClient(mockBucketName);
  };

  describe("when initialized", () => {
    beforeEach(() => {
      arrange();
    });

    it("should have the correct instance variables", () => {
      expect(instance.awsRegion).toBe(process.env.MLA_AWS_REGION);
      expect(instance.bucketName).toBe(mockBucketName);
      expect(instance.s3client).toBe(MockS3Client);
    });

    it("should instantiate the S3 client correctly", () => {
      expect(S3Client).toBeCalledTimes(1);
      expect(S3Client).toBeCalledWith({
        region: process.env.MLA_AWS_REGION,
        credentials: {
          accessKeyId: process.env.MLA_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.MLA_AWS_SECRET_ACCESS_KEY,
        },
      });
    });
  });
});
