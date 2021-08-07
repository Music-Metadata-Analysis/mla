import pagePropsGenerator from "../utils/page.props";

export default function Search() {
  return (
    <>
      <div>Search</div>
    </>
  );
}

export const getStaticProps = pagePropsGenerator({ pageKey: "search" });
