import Flagsmith from "flagsmith-nodejs";
import type { FlagVendorClientInterface } from "../../../../types/integrations/flags/vendor.types";

export default class FlagSmithClient implements FlagVendorClientInterface {
  environment: string;

  constructor(environment: string) {
    this.environment = environment;
  }

  isEnabled = async (flagName: string) => {
    const flagsmith = new Flagsmith({
      environmentKey: this.environment,
    });

    const flags = await flagsmith.getEnvironmentFlags();
    return flags.isFeatureEnabled(flagName);
  };
}
