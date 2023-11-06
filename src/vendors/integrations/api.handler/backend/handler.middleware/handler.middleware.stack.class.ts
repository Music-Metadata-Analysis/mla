import EnforceMethodMiddleware from "./middleware/enforce.method.middleware.class";
import type { HttpApiClientHttpMethodType } from "@src/contracts/api/types/clients/http.client.types";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type {
  ApiHandlerVendorMiddlewareInterface,
  ApiHandlerVendorMiddlewareStackInterface,
  ApiHandlerVendorRequestHandlerType,
  ApiHandlerVendorRequestHandlerWithNextType,
} from "@src/vendors/types/integrations/api.handler/vendor.backend.types";

export default class RouteHandlerMiddleWareStack
  implements ApiHandlerVendorMiddlewareStackInterface
{
  protected beforeStack: ApiHandlerVendorMiddlewareInterface[] = [];
  protected afterStack: ApiHandlerVendorMiddlewareInterface[] = [];

  public createHandler(
    method: HttpApiClientHttpMethodType,
    handler: ApiHandlerVendorRequestHandlerWithNextType
  ): ApiHandlerVendorRequestHandlerType {
    this.attachMethodEnforcementMiddleware(method);
    this.attachHandler(handler);

    return async (
      req: ApiFrameworkVendorApiRequestType,
      res: ApiFrameworkVendorApiResponseType
    ) => {
      await (
        await this.createCallStack(this.beforeStack, this.afterStack)
      )(req, res);
    };
  }

  protected attachMethodEnforcementMiddleware(
    method: HttpApiClientHttpMethodType
  ): void {
    this.beforeStack.unshift(new EnforceMethodMiddleware(method));
  }

  protected attachHandler(handler: ApiHandlerVendorRequestHandlerWithNextType) {
    class HandlerAsMiddleWare implements ApiHandlerVendorMiddlewareInterface {
      async handler(
        req: ApiFrameworkVendorApiRequestType,
        res: ApiFrameworkVendorApiResponseType,
        next: () => Promise<void>,
        finished: () => Promise<void>
      ): Promise<void> {
        await handler(req, res, finished);
      }
    }

    this.beforeStack.push(new HandlerAsMiddleWare());
  }

  protected createCallStack(
    stack: ApiHandlerVendorMiddlewareInterface[],
    nextStack: ApiHandlerVendorMiddlewareInterface[],
    index = 0
  ): ApiHandlerVendorRequestHandlerType {
    const finishedFn =
      nextStack && nextStack.length > 0
        ? this.createCallStack(nextStack, [])
        : () => undefined;
    const nextFn =
      index == stack.length - 1
        ? finishedFn
        : this.createCallStack(stack, nextStack, index + 1);
    return async (
      req: ApiFrameworkVendorApiRequestType,
      res: ApiFrameworkVendorApiResponseType
    ): Promise<void> => {
      const finish = async () => await finishedFn(req, res);
      const next = async () => await nextFn(req, res);
      await stack[index].handler(req, res, next, finish);
    };
  }

  public useBefore(middleware: ApiHandlerVendorMiddlewareInterface): void {
    this.beforeStack.push(middleware);
  }

  public useAfter(middleware: ApiHandlerVendorMiddlewareInterface): void {
    this.afterStack.push(middleware);
  }
}
