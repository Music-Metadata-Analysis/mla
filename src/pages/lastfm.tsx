import { useRouter } from "next/router";
import pagePropsGenerator from "../utils/page.props.server";

export default function LastFM() {
  const router = useRouter();
  const { username } = router.query;

  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <div>{`lastfm: username: ${username}`}</div>
    </>
  );
}

export const getServerSideProps = pagePropsGenerator({ pageKey: "lastfm" });
