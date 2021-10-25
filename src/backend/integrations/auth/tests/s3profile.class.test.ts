import { PutObjectCommand } from "@aws-sdk/client-s3";
import S3Profile from "../s3profile.class";

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

describe("S3Profile", () => {
  let instance: S3Profile;
  let originalEnvironment: typeof process.env;
  const mockEmail = "some.human.email@gmail.com";
  const mockProfile = {
    id: "123218372198379128739821",
    name: "Some Human",
    email: mockEmail,
    image: "http://path/to/profile",
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
    instance = new S3Profile(process.env.AUTH_EMAILS_BUCKET_NAME);
  };

  describe("writeProfileToS3", () => {
    beforeEach(async () => {
      arrange();
    });

    describe("with a valid profile", () => {
      beforeEach(async () => {
        await instance.writeProfileToS3(mockProfile);
      });

      it("should send the profile to the S3 bucket as expected", () => {
        const expectedCommand = {
          Body: JSON.stringify(mockProfile),
          Bucket: process.env.AUTH_EMAILS_BUCKET_NAME,
          Key: mockEmail,
          ContentType: "application/json",
        };
        expect(PutObjectCommand).toBeCalledTimes(1);
        expect(PutObjectCommand).toBeCalledWith(expectedCommand);
        expect(instance.s3client.send).toBeCalledTimes(1);
        expect(instance.s3client.send).toBeCalledWith(MockBucketCommand);
      });
    });

    describe("with an invalid profile", () => {
      beforeEach(async () => {
        await instance.writeProfileToS3({});
      });

      it("should NOT send the profile to the S3 bucket", () => {
        expect(PutObjectCommand).toBeCalledTimes(0);
      });
    });
  });
});
