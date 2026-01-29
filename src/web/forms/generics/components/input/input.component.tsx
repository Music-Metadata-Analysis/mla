import { Input } from "@chakra-ui/react";
import useColour from "@src/web/ui/colours/state/hooks/colour.hook";
import type { InputProps } from "@chakra-ui/react";

const StyledInput = (props: InputProps) => {
  const { inputColour } = useColour();
  return (
    <Input
      borderWidth={1}
      borderColor={inputColour.border}
      bg={inputColour.background}
      color={inputColour.foreground}
      _placeholder={{ color: inputColour.placeHolder }}
      {...props}
    />
  );
};

export default StyledInput;
