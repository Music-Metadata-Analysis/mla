import Image from "next/image";
import type { WebFrameworkVendorImageShimProps } from "@src/types/clients/web.framework/vendor.types";

const NextImageShim = (props: WebFrameworkVendorImageShimProps) => {
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image {...props} />;
};

export default NextImageShim;
