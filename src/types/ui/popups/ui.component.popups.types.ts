import type { FC } from "react";

export interface UserInterfacePopUpsComponentProps {
  message: string;
  onClose: () => void;
}

export type UserInterfacePopUpsComponentType =
  FC<UserInterfacePopUpsComponentProps>;
