import NextConnectHandlerFactory from "../backend/handler.factory/next-connect";

jest.mock("../handler.factory/next-connect.ts");

export const MockNextConnectHandlerFactory = NextConnectHandlerFactory;
