import NextConnectHandlerFactory from "../backend/handler.factory/next-connect";
import RouteHandlerMiddleWareStack from "../backend/handler.middleware/handler.middleware.stack.class";

jest.mock("../backend/handler.factory/next-connect");
jest.mock("../backend/handler.middleware/handler.middleware.stack.class");

export const MockNextConnectHandlerFactory = NextConnectHandlerFactory;
export const MockRouteHandlerMiddleWareStack = RouteHandlerMiddleWareStack;
