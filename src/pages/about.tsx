import pagePropsGenerator from "../utils/page.props";

export default function About() {
  return (
    <>
      <div>About</div>
    </>
  );
}

export const getStaticProps = pagePropsGenerator({ pageKey: "about" });
