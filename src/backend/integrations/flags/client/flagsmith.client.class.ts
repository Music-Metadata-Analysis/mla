import Flagsmith from "flagsmith-nodejs";
import type { FlagVendorClientInterface } from "../../../../types/integrations/flags/vendor.types";

export default class FlagSmithClient implements FlagVendorClientInterface {
  protected environment: string;

  constructor(environment: unknown) {
    this.environment = environment as string;
  }

  isEnabled = async (flagName: string) => {
    const flagsmith = new Flagsmith({
      environmentKey: this.environment,
    });

    const flags = await flagsmith.getEnvironmentFlags();
    return flags.isFeatureEnabled(flagName);
  };
}
