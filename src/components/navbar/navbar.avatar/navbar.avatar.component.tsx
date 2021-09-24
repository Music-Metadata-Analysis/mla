import { Avatar } from "@chakra-ui/react";
import NextLink from "next/link";
import { DimmingImage } from "./navbar.avatar.styles";
import useAnalytics from "../../../hooks/analytics";
import LastFMIcon from "../../icons/lastfm/lastfm.icon";

export const testIDs = {
  NavBarAvatarLink: "NavBarAvatarLink",
};

interface NavBarAvatarProps {
  href: string;
  image: string;
}

const NavBarAvatar = ({ href, image }: NavBarAvatarProps) => {
  const analytics = useAnalytics();

  return (
    <NextLink href={href} passHref>
      <a data-testid={testIDs.NavBarAvatarLink} target="_blank">
        <DimmingImage
          onClick={(e) => analytics.trackExternalLinkClick(e, href)}
        >
          <Avatar
            loading={"eager"}
            cursor={"pointer"}
            size={"sm"}
            src={image}
            icon={<LastFMIcon />}
          />
        </DimmingImage>
      </a>
    </NextLink>
  );
};

export default NavBarAvatar;
