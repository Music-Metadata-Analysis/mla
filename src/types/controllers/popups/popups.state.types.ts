export interface PopUpsControllerStateInterface {
  FeedBack: { status: boolean };
}

export type PopUpComponentNameType = keyof PopUpsControllerStateInterface;
