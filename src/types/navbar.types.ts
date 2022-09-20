import type { ToggleHookType } from "../hooks/utility/toggle";

export interface NavBarContextInterface {
  hamburger: ToggleHookType;
  mobileMenu: ToggleHookType;
  navigation: ToggleHookType;
}

export interface NavBarProviderInterface {
  children: React.ReactNode;
}
