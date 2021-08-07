import pagePropsGenerator from "../utils/page.props";

export default function Index() {
  return (
    <>
      <div>Index</div>
    </>
  );
}

export const getStaticProps = pagePropsGenerator({ pageKey: "home" });
