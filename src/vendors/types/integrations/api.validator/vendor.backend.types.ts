export interface ApiValidationVendorResponseInterface {
  valid: boolean;
  errors?: unknown;
}

export type ApiValidationVendorValidatorFunctionType = (
  payload: Record<string | number | symbol, unknown>
) => ApiValidationVendorResponseInterface;

export interface ApiValidationVendorBackendInterface {
  [key: string]: {
    [key: string]: ApiValidationVendorValidatorFunctionType;
  };
  lastfm: {
    playCountByArtist: ApiValidationVendorValidatorFunctionType;
  };
}
