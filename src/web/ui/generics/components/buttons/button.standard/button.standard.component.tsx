import BaseButton from "../button.base/button.base.component";
import AnalyticsButtonWrapper from "@src/web/analytics/collection/components/analytics.button/analytics.button.container";
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
    <AnalyticsButtonWrapper buttonName={analyticsName}>
      <BaseButton {...buttonProps}>{children}</BaseButton>
    </AnalyticsButtonWrapper>
  );
}
