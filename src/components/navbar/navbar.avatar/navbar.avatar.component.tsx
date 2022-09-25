import { Avatar } from "@chakra-ui/react";
import useAuth from "@src/hooks/auth";
import useColour from "@src/hooks/colour";

const NavBarAvatar = () => {
  const { user } = useAuth();
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
