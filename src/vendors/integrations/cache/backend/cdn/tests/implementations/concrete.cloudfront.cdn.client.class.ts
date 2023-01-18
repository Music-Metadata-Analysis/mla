import CloudFrontCdnBaseClass from "@src/vendors/integrations/cache/backend/cdn/cloudfront";

export const mockCdnFolderName = "mock/folder";

export const mockObjectCreator = jest.fn((objectName: string) => {
  return Promise.resolve(`${objectName}>Created`);
});

export default class ConcreteCloudFrontCdnClient extends CloudFrontCdnBaseClass<string> {
  protected cacheFolderName = mockCdnFolderName;

  protected createNewObject(objectName: string): Promise<string> {
    return mockObjectCreator(objectName);
  }
  protected deserializeObjectForJavascript(serializedObject: string): string {
    return `${serializedObject}>mockDeserializedObject`;
  }
  protected serializeObjectForStorage(deserializedObject: string): string {
    return `${deserializedObject}>mockSerializedObject`;
  }
}
