import { Button } from "@chakra-ui/react";
import useColour from "../../../hooks/colour";
import AnalyticsWrapper from "../analytics/analytics.component";
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
  const { buttonColour } = useColour();

  return (
    <AnalyticsWrapper buttonName={analyticsName}>
      <Button
        bg={buttonColour.background}
        color={buttonColour.foreground}
        _hover={{
          bg: buttonColour.hoverBackground,
        }}
        borderWidth={1}
        borderColor={buttonColour.border}
        {...buttonProps}
      >
        {children}
      </Button>
    </AnalyticsWrapper>
  );
}
