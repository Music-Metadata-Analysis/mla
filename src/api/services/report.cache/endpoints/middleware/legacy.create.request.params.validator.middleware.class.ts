import * as status from "@src/config/status";
import { keysToLower } from "@src/utilities/generics/objects";
import { apiValidationVendorBackend } from "@src/vendors/integrations/api.validation/vendor.backend";
import type { ApiEndpointRequestQueryParamType } from "@src/contracts/api/types/request.types";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type { ApiHandlerVendorMiddlewareInterface } from "@src/vendors/types/integrations/api.handler/vendor.backend.types";
import type { ApiValidationVendorBackendInterface } from "@src/vendors/types/integrations/api.validator/vendor.backend.types";

export default class LegacyCreateRequestParamsValidatorMiddleware
  implements ApiHandlerVendorMiddlewareInterface
{
  protected readonly validators =
    keysToLower<ApiValidationVendorBackendInterface>(
      apiValidationVendorBackend
    );

  constructor(validators: ApiValidationVendorBackendInterface) {
    this.validators = validators;
  }

  public async handler(
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType,
    next: () => Promise<void>,
    finished: () => Promise<void>
  ): Promise<void> {
    const [params, paramErrors] = this.getParams(req);
    if (paramErrors) {
      res.status(400).json(status.STATUS_400_MESSAGE);
      await finished();
    } else {
      req.validatedParams = params;
      await next();
    }
  }

  protected getParams(
    req: ApiFrameworkVendorApiRequestType
  ): [ApiEndpointRequestQueryParamType, boolean] {
    const params = req.query as ApiEndpointRequestQueryParamType;
    Object.keys(params).forEach((k) => {
      if (k !== "username" && params[k]) {
        params[k] = params[k].toString().toLowerCase();
      }
    });
    const error =
      !params.source ||
      !params.report ||
      !params.username ||
      !Object.keys(this.validators).includes(params.source.toString()) ||
      !Object.keys(this.validators[params.source.toString()]).includes(
        params.report.toString()
      );
    return [params, error];
  }
}
