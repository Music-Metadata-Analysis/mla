import { Box, Flex, Avatar } from "@chakra-ui/react";
import UserNameFormContainer from "./forms/username/username.form.container";
import BillboardContainer from "@src/components/billboard/billboard.base/billboard.container";
import LastFMIconContainer from "@src/components/icons/lastfm/lastfm.icon.container";
import Authentication from "@src/web/authentication/sign.in/components/authentication.container";

interface SearchProps {
  route: string;
  titleText: string;
}

export default function Search({ route, titleText }: SearchProps) {
  return (
    <BillboardContainer titleText={titleText}>
      <Authentication />
      <Flex justify={"space-evenly"} align={"center"} w={"100%"}>
        <Box>
          <Avatar
            icon={<LastFMIconContainer width={100} height={100} />}
            width={[50, 50, 75]}
          />
        </Box>
        <Box pl={5}>
          <UserNameFormContainer route={route} />
        </Box>
      </Flex>
    </BillboardContainer>
  );
}
