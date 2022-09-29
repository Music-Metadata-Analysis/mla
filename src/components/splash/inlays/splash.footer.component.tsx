import Button from "@src/components/button/button.standard/button.standard.component";
import dialogueSettings from "@src/config/dialogue";
import routes from "@src/config/routes";
import useRouter from "@src/hooks/router";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";

export default function SplashBody({ t }: { t: tFunctionType }) {
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
