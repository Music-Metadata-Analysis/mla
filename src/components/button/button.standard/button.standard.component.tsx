import BaseButton from "../button.base/button.base.component";
import AnalyticsWrapper from "@src/components/analytics/analytics.button/analytics.button.component";
import type { ButtonProps } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";

interface StyledButtonProps extends ButtonProps {
  analyticsName: string;
}

export default function StyledButton({
  analyticsName,
  children,
  ...buttonProps
}: PropsWithChildren<StyledButtonProps>) {
  return (
    <AnalyticsWrapper buttonName={analyticsName}>
      <BaseButton {...buttonProps}>{children}</BaseButton>
    </AnalyticsWrapper>
  );
}
