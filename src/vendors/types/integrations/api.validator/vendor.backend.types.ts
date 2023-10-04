export interface ApiValidationVendorResponseInterface {
  valid: boolean;
  errors?: unknown;
}

export interface ApiValidationVendorBackendInterface {
  lastfm: {
    playCountByArtist: (
      payload: Record<string | number | symbol, unknown>
    ) => ApiValidationVendorResponseInterface;
  };
}
