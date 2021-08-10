import pagePropsGenerator from "../utils/page.props";

export default function Search() {
  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <div>Search</div>
    </>
  );
}

export const getStaticProps = pagePropsGenerator({ pageKey: "search" });
