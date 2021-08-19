import pagePropsGenerator from "../utils/page.props.server";

export default function Index() {
  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <div>Index</div>
    </>
  );
}

export const getServerSideProps = pagePropsGenerator({ pageKey: "home" });
