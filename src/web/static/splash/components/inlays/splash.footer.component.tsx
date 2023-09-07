import dialogueSettings from "@src/config/dialogue";
import routes from "@src/config/routes";
import Button from "@src/web/ui/generics/components/buttons/button.standard/button.standard.component";
import type { DialogueInlayComponentInterface } from "@src/web/ui/generics/types/components/dialogue.types";

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
