import { useEffect } from "react";
import FeedbackPopUp from "./popups.components/feedback.popup.component";
import settings from "@src/config/popups";
import usePopUpsController from "@src/hooks/controllers/popups.controller.hook";
import usePopUpsGenerator from "@src/hooks/ui/popups.generator.hook";
import useAuth from "@src/web/authentication/session/hooks/auth.hook";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";
import useMetrics from "@src/web/metrics/collection/state/hooks/metrics.hook";

const popUpName = "FeedBack" as const;

export default function FeedbackPopUpContainer() {
  const { status: authStatus } = useAuth();
  const { t } = useTranslation("main");
  const { metrics } = useMetrics();
  const popups = usePopUpsController();

  usePopUpsGenerator({
    component: FeedbackPopUp,
    message: t(`popups.${popUpName}`),
    name: popUpName,
  });

  useEffect(() => {
    if (
      settings[popUpName].searchMetricCount.includes(metrics["SearchMetric"]) &&
      authStatus === "authenticated"
    ) {
      popups.open(popUpName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metrics]);

  return null;
}
