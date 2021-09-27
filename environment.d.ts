import { MutableEnv } from "./environment.d";

declare global {
  namespace NodeJS {
    export interface ProcessEnv extends MutableEnv {
      NEXT_PUBLIC_ANALYTICS_UA_CODE: string;
      LAST_FM_KEY: string;
      INTEGRATION_TEST_LAST_FM_KEY: string;
    }
  }
}

export {};
