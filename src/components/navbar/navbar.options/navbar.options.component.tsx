import { useRouter } from "next/router";
import useAnalytics from "../../../hooks/analytics";
import NavLink from "../navbar.link/navbar.link.component";

interface NavBarProps {
  menuConfig: { [index: string]: string };
}

const NavBarOptions = ({ menuConfig }: NavBarProps) => {
  const router = useRouter();
  const analytics = useAnalytics();

  return (
    <>
      {Object.keys(menuConfig).map((key) => (
        <NavLink
          key={key}
          selected={router.pathname === menuConfig[key]}
          href={menuConfig[key]}
          trackButtonClick={analytics.trackButtonClick}
        >
          {key}
        </NavLink>
      ))}
    </>
  );
};

export default NavBarOptions;
