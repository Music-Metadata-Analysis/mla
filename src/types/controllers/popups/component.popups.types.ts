import type { FC } from "react";

export interface PopUpComponentProps {
  message: string;
  onClose: () => void;
}

export type PopUpComponentType = FC<PopUpComponentProps>;
