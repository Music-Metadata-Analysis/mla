import pagePropsGenerator from "../utils/page.props.server";

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

export const getServerSideProps = pagePropsGenerator({ pageKey: "about" });
