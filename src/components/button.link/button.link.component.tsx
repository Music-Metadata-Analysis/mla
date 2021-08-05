import NextLink from "next/link";
import useAnalytics from "../../hooks/analytics";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => {
  const analytics = useAnalytics();

  return (
    <div onClick={(e) => analytics.trackButtonClick(e, children)}>
      <NextLink href={href}>{children}</NextLink>
    </div>
  );
};

export default NavLink;
