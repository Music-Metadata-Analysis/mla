import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Switch, useColorMode } from "@chakra-ui/react";

export const TestIDs = {
  ColorModeToggle: "ColorModeToggle",
};

export default function NavBarColorModeToggle() {
  const { toggleColorMode, colorMode } = useColorMode();

  const Icon = () => {
    if (colorMode !== "light") return <MoonIcon size={"md"} />;
    return <SunIcon color="yellow.500" size={"md"} />;
  };

  return (
    <>
      <Icon />
      <Switch
        data-testid={TestIDs.ColorModeToggle}
        ml={2}
        mr={5}
        colorScheme={"yellow"}
        isChecked={colorMode !== "dark"}
        onChange={(e) => {
          e.target.blur();
          toggleColorMode();
        }}
      />
    </>
  );
}
