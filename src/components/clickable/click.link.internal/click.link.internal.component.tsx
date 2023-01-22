import { Box } from "@chakra-ui/react";
import AnalyticsButtonWrapperContainer from "@src/web/analytics/collection/components/analytics.link.internal/analytics.link.internal.container";
import type { MouseEventHandler, PropsWithChildren } from "react";

interface ClickLinkProps {
  clickHandler: MouseEventHandler<HTMLDivElement>;
  path: string;
}

export default function ClickInternalLink({
  children,
  clickHandler,
  path,
}: PropsWithChildren<ClickLinkProps>) {
  return (
    <AnalyticsButtonWrapperContainer href={path}>
      <Box onClick={clickHandler} cursor={"pointer"}>
        {children}
      </Box>
    </AnalyticsButtonWrapperContainer>
  );
}
