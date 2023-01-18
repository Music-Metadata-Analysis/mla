import type { FlagVendorGroupInterface } from "@src/vendors/types/integrations/flags/vendor.backend.types";

export default class FlagSmithGroup implements FlagVendorGroupInterface {
  protected groupHash: { [index: string]: string };

  constructor(groupList: unknown) {
    this.groupHash = groupList as { [index: string]: string };
  }

  getFromIdentifier = (identifier?: string | null) => {
    if (identifier) {
      const group = this.groupHash[identifier.toLowerCase()];
      if (group) return group;
    }
    return null;
  };
}
