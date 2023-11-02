import Image from "next/image";
import { isTest } from "@src/utilities/generics/env";
import type { WebFrameworkVendorImageShimProps } from "@src/vendors/types/integrations/web.framework/vendor.types";

const NextImageShim = (props: WebFrameworkVendorImageShimProps) => {
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image fill={isTest()} {...props} quality={100} />;
};

export default NextImageShim;
