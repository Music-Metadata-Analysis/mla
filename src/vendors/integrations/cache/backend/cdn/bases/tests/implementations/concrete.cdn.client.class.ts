import CdnAbstractBaseClient from "@src/vendors/integrations/cache/backend/cdn/bases/cdn.base.client.class";

export const mockObjectCreator = jest.fn((objectName: string) => {
  return Promise.resolve(`${objectName}>Created`);
});

export default class ConcreteCdnClient extends CdnAbstractBaseClient<string> {
  public cacheTypeName = "mockCdnClient";

  protected createNewObject(objectName: string): Promise<string> {
    return mockObjectCreator(objectName);
  }
  protected isCachedResponse(response: Response): boolean {
    return response.headers.get("mockHeader") == "Hit";
  }
  protected getOriginServerStorageLocation(objectName: string): string {
    return `${objectName}>transformed`;
  }
  protected getOriginServerUrlFromObjectName(objectName: string): string {
    return `https://mockCacheServer/${objectName}`;
  }
  protected deserializeObjectForJavascript(serializedObject: string): string {
    return `${serializedObject}>mockDeserializedObject`;
  }
  protected serializeObjectForStorage(deserializedObject: string): string {
    return `${deserializedObject}>mockSerializedObject`;
  }
}
