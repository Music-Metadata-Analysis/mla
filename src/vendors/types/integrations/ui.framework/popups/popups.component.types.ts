import type { FC } from "react";

export interface PopUpComponentProps {
  message: string;
  onClose: () => void;
  subComponents: { [key: string]: FC };
}

export type PopUpComponentType = FC<PopUpComponentProps>;
