import QueryString from "../window.location.query.string";

describe(QueryString.name, () => {
  let instance: QueryString;
  let replaceStateSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    instance = new QueryString();
    replaceStateSpy = jest.spyOn(window.history, "replaceState");
  });

  afterAll(() => window.history.replaceState({}, "", window.location.pathname));

  const compareSearchParamsToObject = (
    currentParams: URLSearchParams,
    testParams: Record<string, string>
  ) => {
    let count = 0;
    currentParams.forEach(([k, v]) => {
      expect(testParams[k]).toBe(testParams[v]);
      count++;
    });
    expect(Object.keys(testParams).length).toBe(count);
  };

  describe.each([
    [1, { query: "example 1" }, { query: "example 2", number: "1" }],
    [2, { query: "example 3" }, { query: "example 4", number: "2" }],
    [3, { other: "example" }, { query: "example 5", number: "3" }],
  ])("with query scenario %s", (number, existingQuery, newQuery) => {
    describe("with no existing query strings in the current url", () => {
      beforeEach(() => {
        window.history.replaceState({}, "", window.location.pathname);
      });

      describe("get", () => {
        const identifier = "query";
        let result: string | null;

        beforeEach(() => {
          result = instance.get(identifier);
        });

        it("should return the correct value", () => {
          const currentParams = new URLSearchParams(window.location.search);
          expect(result).toBe(currentParams.get(identifier));
        });
      });

      describe("update", () => {
        let testParams: Record<string, string>;

        beforeEach(() => {
          instance.update(newQuery);
          testParams = { ...newQuery };
        });

        it("should update the current url's query string", () => {
          const currentParams = new URLSearchParams(window.location.search);
          compareSearchParamsToObject(currentParams, testParams);
        });

        it("it should not reload the page", () => {
          expect(replaceStateSpy).toHaveBeenCalledWith(
            {},
            "",
            `${window.location.pathname}?${new URLSearchParams(testParams)}`
          );
        });
      });

      describe("remove", () => {
        let testParams: Record<string, string>;

        beforeEach(() => {
          instance.remove(["query", "number"]);
          testParams = {};
        });

        it("should not modify the current url's query", () => {
          const currentParams = new URLSearchParams(window.location.search);
          compareSearchParamsToObject(currentParams, testParams);
        });
      });
    });

    describe("with an existing query string in the current url", () => {
      beforeEach(() => {
        window.history.replaceState({}, "", window.location.pathname);
        instance.update(existingQuery);
      });

      describe("get", () => {
        const identifier = "query";
        let result: string | null;

        beforeEach(() => {
          result = instance.get(identifier);
        });

        it("should return the correct value", () => {
          const currentParams = new URLSearchParams(window.location.search);
          expect(result).toBe(currentParams.get(identifier));
        });
      });

      describe("update", () => {
        let testParams: Record<string, string>;

        beforeEach(() => {
          instance.update(newQuery);
          testParams = { ...existingQuery, ...newQuery };
        });

        it("should add the specified query strings", () => {
          const currentParams = new URLSearchParams(window.location.search);
          compareSearchParamsToObject(currentParams, testParams);
        });

        it("it should not reload the page", () => {
          expect(replaceStateSpy).toHaveBeenCalledWith(
            {},
            "",
            `${window.location.pathname}?${new URLSearchParams(testParams)}`
          );
        });
      });

      describe("remove", () => {
        let testParams: Record<string, string>;

        beforeEach(() => {
          instance.remove(["query", "number"]);
          testParams = { ...existingQuery, ...newQuery };
          delete testParams.query;
          delete testParams.number;
        });

        it("should remove the selected query strings", () => {
          const currentParams = new URLSearchParams(window.location.search);
          compareSearchParamsToObject(currentParams, testParams);
        });

        it("it should not reload the page", () => {
          expect(replaceStateSpy).toHaveBeenCalledWith(
            {},
            "",
            `${window.location.pathname}?${new URLSearchParams(testParams)}`
          );
        });
      });
    });
  });
});
