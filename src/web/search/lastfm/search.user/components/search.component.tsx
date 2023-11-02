import { Box, Flex, Avatar } from "@chakra-ui/react";
import Authentication from "@src/web/authentication/sign.in/components/authentication.container";
import UserNameFormContainer from "@src/web/forms/lastfm/components/username/username.form.container";
import BillboardContainer from "@src/web/ui/generics/components/billboard/billboard.base/billboard.container";
import LastFMIconContainer from "@src/web/ui/generics/components/icons/lastfm/lastfm.icon.container";

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
            icon={<LastFMIconContainer />}
            width={[50, 50, 75]}
            height={[50, 50, 75]}
          />
        </Box>
        <Box pl={5}>
          <UserNameFormContainer route={route} />
        </Box>
      </Flex>
    </BillboardContainer>
  );
}
