import { Box, Flex, useToast, Avatar } from "@chakra-ui/react";
import SearchContainer from "./search.container";
import Authentication from "@src/components/authentication/authentication.container";
import Billboard from "@src/components/billboard/billboard.component";
import LastFMIcon from "@src/components/icons/lastfm/lastfm.icon";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";

interface SearchUIProps {
  route: string;
  title: string;
  t: tFunctionType;
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
      <Flex justify={"space-evenly"} align={"center"} w={"100%"}>
        <Box>
          <Avatar
            icon={<LastFMIcon width={100} height={100} />}
            width={[50, 50, 75]}
          />
        </Box>
        <Box pl={5}>
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
