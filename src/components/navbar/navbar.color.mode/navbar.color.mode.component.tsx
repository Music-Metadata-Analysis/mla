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
    if (colorMode !== "light") return <MoonIcon size={"md"} />;
    return <SunIcon color="yellow.500" size={"md"} />;
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
        ml={2}
        mr={3}
        colorScheme={"yellow"}
        isChecked={colorMode !== "dark"}
        onChange={changeHandler}
      />
    </>
  );
}
