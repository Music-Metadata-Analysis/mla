import { Avatar } from "@chakra-ui/react";
import useColour from "@src/hooks/ui/colour.hook";

export interface NavBarAvatarProps {
  user: {
    name?: string;
    image?: string;
  };
}

const NavBarAvatar = ({ user }: NavBarAvatarProps) => {
  const { buttonColour } = useColour();

  return (
    <Avatar
      bg={buttonColour.background}
      loading={"eager"}
      name={user?.name}
      size={"sm"}
      src={user?.image}
    />
  );
};

export default NavBarAvatar;
