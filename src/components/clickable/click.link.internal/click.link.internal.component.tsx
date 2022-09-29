import { Box } from "@chakra-ui/react";
import AnalyticsWrapper from "@src/components/analytics/analytics.link.internal/analytics.link.internal.component";
import useRouter from "@src/hooks/router";
import type { PropsWithChildren } from "react";

interface ClickLinkProps {
  path: string;
}

export default function ClickInternalLink({
  children,
  path,
}: PropsWithChildren<ClickLinkProps>) {
  const router = useRouter();

  return (
    <AnalyticsWrapper href={path}>
      <Box onClick={() => router.push(path)} cursor={"pointer"}>
        {children}
      </Box>
    </AnalyticsWrapper>
  );
}
