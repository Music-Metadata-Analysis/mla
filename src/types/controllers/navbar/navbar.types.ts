import type { ToggleHookType } from "@src/hooks/utility/toggle.hook";

export interface NavBarControllerContextInterface {
  hamburger: ToggleHookType;
  mobileMenu: ToggleHookType;
  navigation: ToggleHookType;
}

export interface NavBarControllerProviderInterface {
  children: React.ReactNode;
}
