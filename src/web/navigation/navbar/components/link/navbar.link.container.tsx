import NavLink from "./navbar.link.component";
import useRouter from "@src/web/navigation/routing/hooks/router.hook";
import type { ButtonClickHandlerType } from "@src/types/analytics.types";
import type { MouseEvent } from "react";

interface NavLinkContainerProps {
  children: string;
  closeMobileMenu: () => void;
  transaction: boolean;
  path: string;
  selected: boolean;
  tracker: ButtonClickHandlerType;
}

const NavLinkContainer = ({
  children,
  closeMobileMenu,
  path,
  selected,
  tracker: trackButtonClick,
  transaction,
}: NavLinkContainerProps) => {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    trackButtonClick(e, children);
    closeMobileMenu();
    router.push(path);
  };

  return (
    <NavLink
      handleClick={handleClick}
      selected={selected}
      transaction={transaction}
    >
      {children}
    </NavLink>
  );
};

export default NavLinkContainer;
