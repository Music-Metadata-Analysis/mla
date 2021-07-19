import type { Await } from "./promise.types";

export type FetchResponse = Await<ReturnType<typeof fetch>>;

export type HttpMethodType = "GET" | "POST";

export type StatusMessageType = {
  detail: string;
};
