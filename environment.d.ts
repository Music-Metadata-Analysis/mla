// tslint:disable:no-namespace
declare namespace NodeJS {
  interface ProcessEnv {
    LASTFM_CACHE_AWS_ACCESS_KEY_ID: string;
    LASTFM_CACHE_AWS_SECRET_ACCESS_KEY: string;
    LASTFM_CACHE_AWS_REGION: string;
    LASTFM_CACHE_AWS_S3_BUCKET_NAME: string;
    LASTFM_CACHE_AWS_CLOUDFRONT_DOMAIN_NAME: string;
    INTEGRATION_TEST_LAST_FM_KEY: string;
    LAST_FM_KEY: string;
    NEXT_PUBLIC_ANALYTICS_UA_CODE: string;
  }
}
