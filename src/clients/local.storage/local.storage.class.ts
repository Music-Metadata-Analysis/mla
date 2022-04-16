import type {
  LocalStorageResponseTypes,
  LocalStorageObjectInterface,
} from "../../types/clients/local.storage/local.storage.types";

class LocalStorageClient<ResponseType extends LocalStorageResponseTypes> {
  lifespan = 24 * 3600 * 1000;

  get(category: string, index: string): ResponseType | null {
    const storage = this.getCategory(category);
    const search = storage.find((entry) => entry.index === index);
    if (search) return search.content;
    return null;
  }

  set(category: string, index: string, content: ResponseType) {
    const storage = this.getCategory(category);
    storage.push({
      index,
      expiry: new Date(Date.now() + this.lifespan),
      content,
    });
    localStorage.setItem(category, JSON.stringify(storage));
  }

  private getCategory(
    category: string
  ): Array<LocalStorageObjectInterface<ResponseType>> {
    const result = localStorage.getItem(category);
    if (result) {
      return this.filterCategory(JSON.parse(result));
    }
    return [];
  }

  private filterCategory(
    entityList: Array<LocalStorageObjectInterface<ResponseType>>
  ) {
    const now = new Date();
    const valid = entityList.filter((entry) => new Date(entry.expiry) > now);
    return valid;
  }
}

export default LocalStorageClient;
