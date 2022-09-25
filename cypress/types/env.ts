import type env from "@cypress/config/env";

export type envVarType = { [T in keyof typeof env]: string };
export type envVarSetType = typeof env;
