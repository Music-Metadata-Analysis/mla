import Flagsmith from "flagsmith-nodejs";
import type { FlagProviderInterface } from "../../../types/integrations/flags/vendor.types";

export default class FlagSmithClient implements FlagProviderInterface {
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
