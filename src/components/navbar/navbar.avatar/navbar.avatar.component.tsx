import { Avatar } from "@chakra-ui/react";
import NextLink from "next/link";
import { DimmingImage } from "./navbar.avatar.styles";
import useAnalytics from "../../../hooks/analytics";
import FallBackIcon from "../navbar.fallback.icon/navbar.fallback.icon.component";
import type { NavBarAvatarClickSource } from "../../../types/analytics.types";

export const testIDs = {
  NavBarAvatarLink: "NavBarAvatarLink",
};

interface NavBarAvatarProps {
  href: string;
  image: string;
}

const NavBarAvatar = ({ href, image }: NavBarAvatarProps) => {
  const analytics = useAnalytics();
  const clickSource: NavBarAvatarClickSource = image
    ? "AVATAR: PROFILE"
    : "AVATAR: LASTFM";

  return (
    <NextLink href={href} passHref>
      <a data-testid={testIDs.NavBarAvatarLink} target="_blank">
        <DimmingImage
          onClick={(e) => analytics.trackButtonClick(e, clickSource)}
        >
          <Avatar
            loading={"eager"}
            cursor={"pointer"}
            size={"sm"}
            src={image}
            icon={<FallBackIcon />}
          />
        </DimmingImage>
      </a>
    </NextLink>
  );
};

export default NavBarAvatar;
