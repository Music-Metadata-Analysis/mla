import SpinnerModal from "./modal.spinner.component";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";

export interface AuthenticationSpinnerModalContainerProps {
  onClose: () => void;
}

export default function AuthenticationSpinnerModalContainer({
  onClose,
}: AuthenticationSpinnerModalContainerProps) {
  const { t } = useTranslation("authentication");

  return <SpinnerModal onClose={onClose} titleText={t("spinnerTitle")} />;
}
