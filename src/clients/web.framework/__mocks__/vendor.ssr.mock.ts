import type { VendorUtilities } from "@src/types/clients/web.framework/vendor.types";

export const mockServerSideProps = "mockServerSideProps";
export const mockStaticProps = "mockStaticProps";

export const mockUtilities: VendorUtilities = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serverSideProps: jest.fn(() => mockServerSideProps) as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  staticProps: jest.fn(() => mockStaticProps) as any,
};
