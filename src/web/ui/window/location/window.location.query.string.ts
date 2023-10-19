export default class QueryString {
  get(queryStringVariable: string): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get(queryStringVariable);
  }

  remove(queryStringIdentifiers: string[]): void {
    const params = new URLSearchParams(window.location.search);
    queryStringIdentifiers.forEach((identifier) => {
      params.delete(identifier);
    });
    this.replaceQueryStringContent(params);
  }

  update(newQueryContent: Record<string, string>): void {
    const params = new URLSearchParams(window.location.search);
    Object.entries(newQueryContent).forEach(([k, v]) => params.set(k, v));
    this.replaceQueryStringContent(params);
  }

  protected replaceQueryStringContent(params: URLSearchParams): void {
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params}`
    );
  }
}
