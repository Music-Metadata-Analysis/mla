import pagePropsGenerator from "../utils/page.props.static";

export default function About() {
  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <div>About</div>
    </>
  );
}

export const getStaticProps = pagePropsGenerator({ pageKey: "about" });
