import type { config } from "@cypress/config";

export type CypressConfigurationType = { [T in config]: string };
