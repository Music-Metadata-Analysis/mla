import SpinnerModal from "./modal.spinner.component";
import useLocale from "@src/hooks/locale.hook";

export interface AuthenticationSpinnerModalContainerProps {
  onClose: () => void;
}

export default function AuthenticationSpinnerModalContainer({
  onClose,
}: AuthenticationSpinnerModalContainerProps) {
  const { t } = useLocale("authentication");

  return <SpinnerModal onClose={onClose} titleText={t("spinnerTitle")} />;
}
