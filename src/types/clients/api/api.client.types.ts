import type { Await } from "../../promise.types";

export type FetchResponse = Await<ReturnType<typeof fetch>>;

export type HttpMethodType = "GET" | "POST";

export type StatusMessageType = {
  detail: string;
};

export type ApiResponse<REPORT> = {
  status: number;
  headers: Record<string, string>;
  response: REPORT | StatusMessageType;
};
