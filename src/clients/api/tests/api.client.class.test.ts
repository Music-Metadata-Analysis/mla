import APIClient from "../api.client.class";
import * as status from "@src/config/status";
import type { APIClientHttpMethodType } from "@src/contracts/api/exports.types";

describe("APIClient", () => {
  const client = new APIClient();
  const remotesite = "https://remotesite.com/";
  type responseType = { success: boolean };
  const mockFetchParams = {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
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
      return client.request<responseType>(remotesite);
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
        expect(test).rejects.toThrow(`${getParams.method}: ${remotesite}`);
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
        expect(test).rejects.toThrow(`${getParams.method}: ${remotesite}`);
      });
    });
  });

  describe("post", () => {
    const postParams = {
      ...mockFetchParams,
      method: "POST" as APIClientHttpMethodType,
      cache: "no-cache",
      body: JSON.stringify({ test: "post body" }),
    };

    const arrange = () => {
      return client.request<responseType>(remotesite, {
        method: postParams.method,
        cache: "no-cache",
        body: JSON.parse(postParams.body),
      });
    };

    describe("when an 'ok' status is returned", () => {
      beforeEach(() => setupFetch({ success: true, status: 200 }));

      it("should call the underlying fetch function correctly", async () => {
        await arrange();
        expect(fetch).toBeCalledTimes(1);
        expect(fetch).toBeCalledWith(remotesite, postParams);
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
        expect(fetch).toBeCalledWith(remotesite, postParams);
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
        expect(fetch).toBeCalledWith(remotesite, postParams);
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
        expect(fetch).toBeCalledWith(remotesite, postParams);
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
        expect(fetch).toBeCalledWith(remotesite, postParams);
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
        expect(fetch).toBeCalledWith(remotesite, postParams);
      });

      it("should throw the correct error message", async () => {
        const test = async () => await arrange();
        expect(test).rejects.toThrow(`${postParams.method}: ${remotesite}`);
      });
    });

    describe("when a network error occurs", () => {
      beforeEach(() => setupFetchWithNetworkError());

      it("should call the underlying fetch function correctly", () => {
        arrange().catch(() => null);
        expect(fetch).toBeCalledTimes(1);
        expect(fetch).toBeCalledWith(remotesite, postParams);
      });

      it("should throw the correct error message", async () => {
        const test = async () => arrange();
        expect(test).rejects.toThrow(`${postParams.method}: ${remotesite}`);
      });
    });
  });
});
