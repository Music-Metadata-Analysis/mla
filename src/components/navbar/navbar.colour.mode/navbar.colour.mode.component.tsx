import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Switch } from "@chakra-ui/react";
import type { ColourModeType } from "@src/types/clients/ui/vendor.types";
import type { ChangeEvent } from "react";

export const testIDs = {
  ColorModeToggle: "ColorModeToggle",
};

interface NavBarColorModeToggleProps {
  colourMode: ColourModeType;
  handleChange: (e: ChangeEvent<HTMLElement>) => void;
}

export default function NavBarColorModeToggle({
  colourMode,
  handleChange,
}: NavBarColorModeToggleProps) {
  const Icon = () => {
    if (colourMode !== "light") return <MoonIcon w={5} h={5} />;
    return <SunIcon color="yellow.500" w={5} h={5} />;
  };

  return (
    <>
      <Icon />
      <Switch
        colorScheme={"yellow"}
        data-testid={testIDs.ColorModeToggle}
        isChecked={colourMode !== "dark"}
        ml={[1, 2, 3]}
        mr={[0, 0.5, 0.5]}
        onChange={handleChange}
      />
    </>
  );
}
