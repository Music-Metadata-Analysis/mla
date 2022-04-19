import * as status from "../../../config/status";
import APIClient from "../api.client.class";

describe("APIClient", () => {
  const client = new APIClient();
  const remotesite = "https://remotesite.com/";
  type responseType = { success: boolean };
  const mockFetchParams = {
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "same-origin",
  };

  beforeAll(() => {
    jest.spyOn(window, "fetch");
  });

  afterAll(() => jest.restoreAllMocks());

  afterEach(() => jest.clearAllMocks());

  const setupFetch = (
    {
      success,
      status,
    }: {
      success: boolean;
      status: number;
    },
    headers: [string, string][] = []
  ) => {
    (window.fetch as jest.Mock).mockResolvedValueOnce({
      status,
      headers,
      url: remotesite,
      ok: success,
      json: async () => ({ success }),
    });
  };

  const setupFetchWithNetworkError = () => {
    (window.fetch as jest.Mock).mockResolvedValueOnce(() => {
      throw Error("Mock Error!");
    });
  };

  describe("get", () => {
    const getParams = {
      ...mockFetchParams,
      cache: "default",
      method: "GET",
    };

    const arrange = () => {
      return client.get<responseType>(remotesite);
    };

    describe("when an 'ok' status is returned", () => {
      beforeEach(() => setupFetch({ success: true, status: 200 }));

      it("should call the underlying fetch function correctly", async () => {
        await arrange();
        expect(fetch).toBeCalledTimes(1);
        expect(fetch).toBeCalledWith(remotesite, getParams);
      });

      it("should return a success message", async () => {
        const response = await arrange();
        expect(response).toStrictEqual({
          status: 200,
          headers: {},
          response: { success: true },
        });
      });
    });

    describe("when a '401' status code is returned", () => {
      beforeEach(() => setupFetch({ success: false, status: 401 }));

      it("should call the underlying fetch function correctly", () => {
        arrange();
        expect(fetch).toBeCalledTimes(1);
        expect(fetch).toBeCalledWith(remotesite, getParams);
      });

      it("should return the correct error message", async () => {
        const response = await arrange();
        expect(response).toStrictEqual({
          status: 401,
          headers: {},
          response: status.STATUS_401_MESSAGE,
        });
      });
    });

    describe("when a '404' status code is returned", () => {
      beforeEach(() => setupFetch({ success: false, status: 404 }));

      it("should call the underlying fetch function correctly", () => {
        arrange();
        expect(fetch).toBeCalledTimes(1);
        expect(fetch).toBeCalledWith(remotesite, getParams);
      });

      it("should return the correct error message", async () => {
        const response = await arrange();
        expect(response).toStrictEqual({
          status: 404,
          headers: {},
          response: status.STATUS_404_MESSAGE,
        });
      });
    });

    describe("when a '429' status code is returned", () => {
      beforeEach(() => setupFetch({ success: false, status: 429 }));

      it("should call the underlying fetch function correctly", () => {
        arrange();
        expect(fetch).toBeCalledTimes(1);
        expect(fetch).toBeCalledWith(remotesite, getParams);
      });

      it("should return the correct error message", async () => {
        const response = await arrange();
        expect(response).toStrictEqual({
          status: 429,
          headers: {},
          response: status.STATUS_429_MESSAGE,
        });
      });
    });

    describe("when a '503' status code is returned", () => {
      beforeEach(() =>
        setupFetch({ success: false, status: 503 }, [["retry-after", "0"]])
      );

      it("should call the underlying fetch function correctly", () => {
        arrange();
        expect(fetch).toBeCalledTimes(1);
        expect(fetch).toBeCalledWith(remotesite, getParams);
      });

      it("should return the correct error message", async () => {
        const response = await arrange();
        expect(response).toStrictEqual({
          status: 503,
          headers: { "retry-after": "0" },
          response: status.STATUS_503_MESSAGE,
        });
      });
    });

    describe("when a 'not ok' status is returned", () => {
      beforeEach(() => setupFetch({ success: false, status: 400 }));

      it("should call the underlying fetch function correctly", () => {
        arrange().catch(() => null);
        expect(fetch).toBeCalledTimes(1);
        expect(fetch).toBeCalledWith(remotesite, getParams);
      });

      it("should throw the correct error message", async () => {
        const test = async () => await arrange();
        expect(test).rejects.toThrow(`GET: ${remotesite}`);
      });
    });

    describe("when a network error occurs", () => {
      beforeEach(() => setupFetchWithNetworkError());

      it("should call the underlying fetch function correctly", () => {
        arrange().catch(() => null);
        expect(fetch).toBeCalledTimes(1);
        expect(fetch).toBeCalledWith(remotesite, getParams);
      });

      it("should throw the correct error message", async () => {
        const test = async () => arrange();
        expect(test).rejects.toThrow(`GET: ${remotesite}`);
      });
    });
  });
});
