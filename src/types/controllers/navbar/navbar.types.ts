import type { ToggleHookType } from "@src/utilities/react/hooks/toggle.hook";

export interface NavBarControllerContextInterface {
  hamburger: ToggleHookType;
  mobileMenu: ToggleHookType;
  navigation: ToggleHookType;
}

export interface NavBarControllerProviderInterface {
  children: React.ReactNode;
}
