import { Avatar } from "@chakra-ui/react";
import ClickLink from "../../clickable/click.link.external/click.link.external.component";
import LastFMIcon from "../../icons/lastfm/lastfm.icon";
import DimOnHover from "../../styles/hover.dim/hover.dim.styles";

export const testIDs = {
  NavBarAvatarLink: "NavBarAvatarLink",
};

interface NavBarAvatarProps {
  href: string;
  image: string;
}

const NavBarAvatar = ({ href, image }: NavBarAvatarProps) => {
  return (
    <DimOnHover data-testid={testIDs.NavBarAvatarLink}>
      <ClickLink href={href}>
        <Avatar
          loading={"eager"}
          cursor={"pointer"}
          size={"sm"}
          src={image}
          icon={<LastFMIcon />}
        />
      </ClickLink>
    </DimOnHover>
  );
};

export default NavBarAvatar;
