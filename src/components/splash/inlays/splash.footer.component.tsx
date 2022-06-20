import { useRouter } from "next/router";
import routes from "../../../config/routes";
import Button from "../../button/button.standard/button.standard.component";
import type { TFunction } from "next-i18next";

export default function SplashBody({ t }: { t: TFunction }) {
  const router = useRouter();

  return (
    <>
      <Button
        analyticsName={"Splash Page Start"}
        onClick={() => router.push(routes.search.lastfm.selection)}
        mb={1}
        size={"xs"}
      >
        {t("buttons.start")}
      </Button>
    </>
  );
}
