import NextLink from "next/link";
import useAnalytics from "../../hooks/analytics";

interface SimpleLinkProps {
  href: string;
  children: React.ReactNode;
}

const SimpleLink = ({ href, children }: SimpleLinkProps) => {
  const analytics = useAnalytics();

  return (
    <div onClick={(e) => analytics.trackButtonClick(e, children)}>
      <NextLink href={href}>{children}</NextLink>
    </div>
  );
};

export default SimpleLink;
