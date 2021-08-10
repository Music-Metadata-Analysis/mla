import pagePropsGenerator from "../utils/page.props";

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

export const getStaticProps = pagePropsGenerator({ pageKey: "home" });
