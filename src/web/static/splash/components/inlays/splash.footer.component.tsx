import Button from "@src/components/button/button.standard/button.standard.component";
import dialogueSettings from "@src/config/dialogue";
import routes from "@src/config/routes";
import type { DialogueInlayComponentInterface } from "@src/types/components/dialogue.types";

export default function SplashBody({
  router,
  t,
}: DialogueInlayComponentInterface) {
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
