import NavLink from "../navbar.link/navbar.link.component";
import useAnalytics from "@src/hooks/analytics";
import useLocale from "@src/hooks/locale";
import useRouter from "@src/hooks/router";

interface NavBarProps {
  menuConfig: { [index: string]: string };
}

const NavBarOptions = ({ menuConfig }: NavBarProps) => {
  const router = useRouter();
  const analytics = useAnalytics();
  const { t } = useLocale("navbar");

  return (
    <>
      {Object.keys(menuConfig).map((key) => (
        <NavLink
          key={key}
          selected={router.path === menuConfig[key]}
          path={menuConfig[key]}
          trackButtonClick={analytics.trackButtonClick}
        >
          {t(`menu.${key}`)}
        </NavLink>
      ))}
    </>
  );
};

export default NavBarOptions;
