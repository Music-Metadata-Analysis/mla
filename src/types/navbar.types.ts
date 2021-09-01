export interface NavBarContextInterface {
  isVisible: boolean;
  setIsVisible: (setting: boolean) => void;
}

export interface NavBarProviderInterface {
  children: React.ReactNode;
}
