import { Box, Flex, useToast, Avatar } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import SearchContainer from "./search.container.component";
import Billboard from "../../../billboard/billboard.component";
import LastFMIcon from "../../../icons/lasfm/lastfm.icon";

export default function SearchUI() {
  const toast = useToast();
  const { t } = useTranslation("lastfm");

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
    <Billboard title={t("search.title")}>
      <Flex justify={"space-between"} align={"center"}>
        <Box mb={10}>
          <Avatar
            icon={<LastFMIcon width={100} height={100} />}
            width={[50, 50, 75]}
          />
        </Box>
        <Box pl={[5, 5, 10]} w={"100%"}>
          <SearchContainer
            closeError={closeError}
            openError={openError}
            t={t}
          />
        </Box>
      </Flex>
    </Billboard>
  );
}
