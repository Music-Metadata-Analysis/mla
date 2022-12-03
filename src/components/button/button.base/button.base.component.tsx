import { Button } from "@chakra-ui/react";
import useColour from "@src/hooks/ui/colour.hook";
import type { ButtonProps } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";

export default function BaseButton({
  children,
  ...buttonProps
}: PropsWithChildren<ButtonProps>) {
  const { buttonColour } = useColour();

  return (
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
  );
}
