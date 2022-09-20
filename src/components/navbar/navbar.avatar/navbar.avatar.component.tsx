import { Avatar } from "@chakra-ui/react";
import useAuth from "../../../hooks/auth";
import useColour from "../../../hooks/colour";

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
