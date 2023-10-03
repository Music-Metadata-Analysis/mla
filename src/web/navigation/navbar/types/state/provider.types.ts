import type { ToggleHookType } from "@src/web/ui/generics/state/hooks/toggle.hook";

export interface NavBarControllerContextInterface {
  hamburger: ToggleHookType;
  mobileMenu: ToggleHookType;
  navigation: ToggleHookType;
}

export interface NavBarControllerProviderInterface {
  children: React.ReactNode;
}
