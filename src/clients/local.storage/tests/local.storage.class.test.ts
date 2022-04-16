import LocalStorageClient from "../local.storage.class";
import type { LastFMTopAlbumsReportResponseInterface } from "../../../types/clients/api/lastfm/response.types";
import type { LocalStorageObjectInterface } from "../../../types/clients/local.storage/local.storage.types";

describe("LocalStorageClient", () => {
  let instance: LocalStorageClient<LastFMTopAlbumsReportResponseInterface>;
  let getItemMock: jest.SpyInstance;
  let setItemMock: jest.SpyInstance;
  let dateNowSpy: jest.SpyInstance;
  let mockLocalStorageReport: Array<
    LocalStorageObjectInterface<LastFMTopAlbumsReportResponseInterface>
  >;
  const category = "test category";
  const index = "test index";
  const createdIndex = "test created index";
  const mockReport = {
    mock: "report",
  } as unknown as LastFMTopAlbumsReportResponseInterface;

  beforeEach(() => {
    instance = new LocalStorageClient();
    jest.clearAllMocks();
    const now = Date.now();
    dateNowSpy = jest.spyOn(Date, "now").mockImplementation(() => now);
    getItemMock = jest.spyOn(Storage.prototype, "getItem");
    setItemMock = jest.spyOn(Storage.prototype, "setItem");
  });

  afterEach(() => {
    getItemMock.mockRestore();
    setItemMock.mockRestore();
    dateNowSpy.mockRestore();
  });

  describe("without entries", () => {
    let response: unknown;

    beforeEach(() => getItemMock.mockImplementationOnce(() => null));

    describe("get", () => {
      beforeEach(() => {
        response = instance.get(category, index);
      });

      it("should return null", () => {
        expect(response).toBe(null);
      });

      it("should call getItem with the expected parameters", () => {
        expect(getItemMock).toBeCalledTimes(1);
        expect(getItemMock).toBeCalledWith(category);
      });
    });

    describe("set", () => {
      beforeEach(() => {
        instance.set(category, createdIndex, mockReport);
      });

      it("should call getItem with the expected parameters", () => {
        expect(setItemMock).toBeCalledTimes(1);
        expect(setItemMock).toBeCalledWith(
          category,
          JSON.stringify([
            {
              index: createdIndex,
              expiry: new Date(Date.now() + instance.lifespan),
              content: mockReport,
            },
          ])
        );
      });
    });
  });

  describe("with expired entries", () => {
    let response: unknown;

    beforeEach(() => {
      mockLocalStorageReport = [
        {
          index,
          expiry: new Date(Date.now() - 24 * 3600 * 1000),
          content: mockReport,
        },
      ];
      getItemMock.mockImplementationOnce(() =>
        JSON.stringify(mockLocalStorageReport)
      );
    });

    describe("get", () => {
      beforeEach(() => {
        response = instance.get(category, index);
      });

      it("should return null", () => {
        expect(response).toStrictEqual(null);
      });

      it("should call getItem with the expected parameters", () => {
        expect(getItemMock).toBeCalledTimes(1);
        expect(getItemMock).toBeCalledWith(category);
      });
    });

    describe("set", () => {
      beforeEach(() => {
        instance.set(category, createdIndex, mockReport);
      });

      it("should call getItem with the expected parameters", () => {
        expect(setItemMock).toBeCalledTimes(1);
        expect(setItemMock).toBeCalledWith(
          category,
          JSON.stringify([
            {
              index: createdIndex,
              expiry: new Date(Date.now() + instance.lifespan),
              content: mockReport,
            },
          ])
        );
      });
    });
  });

  describe("with unexpired entries", () => {
    let response: unknown;

    beforeEach(() => {
      mockLocalStorageReport = [
        {
          index,
          expiry: new Date(Date.now() + 24 * 3600 * 1000),
          content: mockReport,
        },
      ];
      getItemMock.mockImplementationOnce(() =>
        JSON.stringify(mockLocalStorageReport)
      );
    });

    describe("get", () => {
      beforeEach(() => {
        response = instance.get(category, index);
      });

      it("should return the mock report", () => {
        expect(response).toStrictEqual(mockReport);
      });

      it("should call getItem with the expected parameters", () => {
        expect(getItemMock).toBeCalledTimes(1);
        expect(getItemMock).toBeCalledWith(category);
      });
    });

    describe("set", () => {
      beforeEach(() => {
        instance.set(category, createdIndex, mockReport);
      });

      it("should call getItem with the expected parameters", () => {
        expect(setItemMock).toBeCalledTimes(1);
        expect(setItemMock).toBeCalledWith(
          category,
          JSON.stringify(
            mockLocalStorageReport.concat([
              {
                index: createdIndex,
                expiry: new Date(Date.now() + instance.lifespan),
                content: mockReport,
              },
            ])
          )
        );
      });
    });
  });
});
