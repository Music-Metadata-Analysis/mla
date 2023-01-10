import type { WebFrameworkVendorSSRUtilitiesInterface } from "@src/vendors/types/integrations/web.framework/vendor.ssr.types";

export const mockServerSideProps = "mockServerSideProps";
export const mockStaticProps = "mockStaticProps";

export const mockUtilities: WebFrameworkVendorSSRUtilitiesInterface = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serverSideProps: jest.fn(() => mockServerSideProps) as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  staticProps: jest.fn(() => mockStaticProps) as any,
};
