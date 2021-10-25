import { useRouter } from "next/router";
import routes from "../../../config/routes";
import Button from "../../button/button.standard/button.standard.component";
import type { TFunction } from "next-i18next";

export default function SplashBody({ t }: { t: TFunction }) {
  const router = useRouter();

  return (
    <>
      <Button
        mb={2}
        onClick={() => router.push(routes.search.lastfm.selection)}
        analyticsName={"Splash Page Start"}
      >
        {t("buttons.start")}
      </Button>
    </>
  );
}
