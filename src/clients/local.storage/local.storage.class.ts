import type { LocalStorageObjectInterface } from "../../types/clients/local.storage/local.storage.types";

class LocalStorageClient {
  lifespan = 24 * 3600 * 1000;

  lookup(category: string, index: string): unknown | null {
    const storage = this.getCategory(category);
    const search = storage.find((entry) => entry.index === index);
    if (search) return search.content;
    return null;
  }

  createEntry(
    category: string,
    index: string,
    content: LocalStorageObjectInterface["content"]
  ) {
    const storage = this.getCategory(category);
    storage.push({
      index,
      expiry: new Date(Date.now() + this.lifespan),
      content,
    });
    localStorage.setItem(category, JSON.stringify(storage));
  }

  private getCategory(category: string): Array<LocalStorageObjectInterface> {
    const result = localStorage.getItem(category);
    if (result) {
      return this.filterCategory(JSON.parse(result));
    }
    return [];
  }

  private filterCategory(entityList: Array<LocalStorageObjectInterface>) {
    const now = new Date();
    const valid = entityList.filter((entry) => new Date(entry.expiry) > now);
    return valid;
  }
}

export default LocalStorageClient;
