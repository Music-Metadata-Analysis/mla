import { Box, Flex, useToast, Avatar } from "@chakra-ui/react";
import SearchContainer from "./search.container.component";
import Authentication from "../../authentication/authentication.container";
import Billboard from "../../billboard/billboard.component";
import LastFMIcon from "../../icons/lastfm/lastfm.icon";
import type { TFunction } from "next-i18next";

interface SearchUIProps {
  route: string;
  title: string;
  t: TFunction;
}

export default function SearchUI({ route, title, t }: SearchUIProps) {
  const toast = useToast();

  const closeError = (fieldname: string) => {
    if (toast.isActive(fieldname)) {
      toast.close(fieldname);
    }
  };

  const openError = (fieldname: string, message: string) => {
    if (!toast.isActive(fieldname)) {
      toast({
        id: fieldname,
        title: message,
        status: "error",
        duration: 1000,
        isClosable: false,
      });
    } else {
      toast.update(fieldname, {
        title: message,
        status: "error",
        duration: 1000,
        isClosable: false,
      });
    }
  };

  return (
    <Billboard title={title}>
      <Authentication />
      <Flex justify={"space-between"} align={"center"}>
        <Box mb={10}>
          <Avatar
            icon={<LastFMIcon width={100} height={100} />}
            width={[50, 50, 75]}
          />
        </Box>
        <Box pl={[5, 5, 10]} w={"100%"}>
          <SearchContainer
            route={route}
            closeError={closeError}
            openError={openError}
            t={t}
          />
        </Box>
      </Flex>
    </Billboard>
  );
}
