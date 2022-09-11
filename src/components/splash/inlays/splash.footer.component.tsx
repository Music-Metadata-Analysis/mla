import { useRouter } from "next/router";
import dialogueSettings from "../../../config/dialogue";
import routes from "../../../config/routes";
import Button from "../../button/button.standard/button.standard.component";
import type { TFunction } from "next-i18next";

export default function SplashBody({ t }: { t: TFunction }) {
  const router = useRouter();

  return (
    <>
      <Button
        {...dialogueSettings.buttonComponentProps}
        analyticsName={"Splash Page Start"}
        onClick={() => router.push(routes.search.lastfm.selection)}
      >
        {t("buttons.start")}
      </Button>
    </>
  );
}
