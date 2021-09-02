import { useRouter } from "next/router";
import { useEffect } from "react";
import routes from "../../../../config/routes";
import BillBoardSpinner from "../../../billboard/billboard.spinner/billboard.spinner.component";
import ErrorDisplay from "../../../errors/display/error.display.component";
import type useLastFM from "../../../../hooks/lastfm";

interface Top20Props {
  username: string;
  user: ReturnType<typeof useLastFM>;
}

export default function Top20({ user, username }: Top20Props) {
  const router = useRouter();

  useEffect(() => {
    user.clear();
    user.top20(username);
    return () => user.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  if (user.userProperties.ratelimited) {
    return (
      <ErrorDisplay
        errorKey={"lastfm_ratelimited"}
        resetError={() => router.reload()}
      />
    );
  }

  if (user.userProperties.error) {
    return (
      <ErrorDisplay
        errorKey={"lastfm_communications"}
        resetError={() => router.push(routes.search)}
      />
    );
  }

  return (
    <BillBoardSpinner whileTrue={!user.userProperties.ready}>
      <div></div>
    </BillBoardSpinner>
  );
}
