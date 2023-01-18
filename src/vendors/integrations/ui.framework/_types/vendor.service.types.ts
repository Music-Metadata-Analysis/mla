import type useChakraColour from "../web/colour.hook/chakra";
import type chakraConfiguration from "../web/config/chakra";
import type { ColorMode } from "@chakra-ui/color-mode";
import type { ColorProps } from "@chakra-ui/styled-system";

export type VendorColourModeType = ColorMode;

export type VendorColourType = NonNullable<ColorProps["color"]>;

export type VendorColourHookType = ReturnType<typeof useChakraColour>;

export type VendorConfigType = typeof chakraConfiguration;

export type VendorStateType = { [key: string]: string } | string;

export interface VendorProviderProps {
  children: JSX.Element;
  cookies: VendorStateType;
}
