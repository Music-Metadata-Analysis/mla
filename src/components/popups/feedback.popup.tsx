import { useEffect } from "react";
import Feedback from "./dialogues/feedback.dialogue";
import PopUp from "./popup/popup.component";
import settings from "@src/config/popups";
import useAuth from "@src/hooks/auth";
import useLocale from "@src/hooks/locale";
import useMetrics from "@src/hooks/metrics";
import useUserInterface from "@src/hooks/ui";

const popUpName = "FeedBack" as const;

export default function FeedbackPopUp() {
  const { metrics } = useMetrics();
  const { status: authStatus } = useAuth();
  const ui = useUserInterface();
  const { t } = useLocale("main");

  useEffect(() => {
    if (
      settings[popUpName].searchMetricCount.includes(metrics["SearchMetric"]) &&
      authStatus === "authenticated"
    ) {
      ui.popups.open(popUpName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metrics]);

  if (!ui.popups.status(popUpName) || authStatus !== "authenticated") {
    return null;
  }

  return (
    <PopUp
      name={popUpName}
      message={t(`popups.${popUpName}`)}
      Component={Feedback}
    />
  );
}
