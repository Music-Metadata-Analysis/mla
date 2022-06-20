import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Switch, useColorMode } from "@chakra-ui/react";
import useAnalytics from "../../../hooks/analytics";
import type { ChangeEvent } from "react";

export const TestIDs = {
  ColorModeToggle: "ColorModeToggle",
};

export default function NavBarColorModeToggle() {
  const analytics = useAnalytics();
  const { toggleColorMode, colorMode } = useColorMode();

  const Icon = () => {
    if (colorMode !== "light") return <MoonIcon w={5} h={5} />;
    return <SunIcon color="yellow.500" w={5} h={5} />;
  };

  const changeHandler = (e: ChangeEvent<HTMLElement>) => {
    e.target.blur();
    analytics.trackButtonClick(e, "Colour Mode Toggle");
    toggleColorMode();
  };

  return (
    <>
      <Icon />
      <Switch
        data-testid={TestIDs.ColorModeToggle}
        ml={[1, 2, 3]}
        mr={[0, 1, 2]}
        colorScheme={"yellow"}
        isChecked={colorMode !== "dark"}
        onChange={changeHandler}
      />
    </>
  );
}
