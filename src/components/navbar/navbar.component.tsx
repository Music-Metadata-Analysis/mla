import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import NavBarLogo from "./navbar.logo/navbar.logo.component";
import NavBarOptions from "./navbar.options/navbar.options.component";
import Spinner from "./navbar.spinner/navbar.spinner.component";
import { HomePage } from "../../config/lastfm";
import useLastFM from "../../hooks/lastfm";
import Condition from "../condition/condition.component";
import type { LastFMImageDataInterface } from "../../types/integrations/lastfm/api.types";

export const testIDs = {
  NavBarRoot: "NavBarRoot",
  NavBarMenu: "NavBarMenu",
  NavBarMobileMenu: "NavBarMobileMenu",
  NavBarMobileMenuButton: "NavBarMobileMenuButton",
};

interface NavBarProps {
  menuConfig: { [index: string]: string };
}

export default function NavBar({ menuConfig }: NavBarProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useLastFM();

  const getProfileImageUrl = (size: LastFMImageDataInterface["size"]) => {
    const image = user.userProperties.data.report.image.find(
      (thisImage) => thisImage.size == size
    );
    if (image) return image["#text"];
    return "";
  };

  const getProfileUrl = () => {
    if (user.userProperties.profileUrl) return user.userProperties.profileUrl;
    return HomePage;
  };

  useEffect(() => {
    if (!user.userProperties.ready) onClose;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.userProperties.ready]);

  return (
    <>
      <Box
        fontSize={[18, 18, 20]}
        style={{ position: "fixed", top: 0, width: "100%" }}
        data-testid={testIDs.NavBarRoot}
        bg={useColorModeValue("gray.100", "gray.900")}
        px={4}
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <NavBarLogo
            href={getProfileUrl()}
            image={getProfileImageUrl("small")}
          />
          <Spinner whileTrue={!user.userProperties.ready}>
            <Flex
              data-testid={testIDs.NavBarMenu}
              h={16}
              alignItems={"center"}
              justifyContent={"flex-end"}
            >
              <IconButton
                data-testid={testIDs.NavBarMobileMenuButton}
                size={"md"}
                icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                aria-label={"Open Menu"}
                display={{ sm: "none" }}
                onClick={isOpen ? onClose : onOpen}
              />
              <HStack spacing={8} alignItems={"center"}>
                <HStack
                  as={"nav"}
                  spacing={4}
                  display={{ base: "none", sm: "flex" }}
                >
                  <NavBarOptions menuConfig={menuConfig} />
                </HStack>
              </HStack>
            </Flex>
          </Spinner>
        </Flex>
        <Condition isTrue={isOpen}>
          <Box
            data-testid={testIDs.NavBarMobileMenu}
            pb={4}
            display={{ sm: "none" }}
          >
            <Stack as={"nav"} spacing={4}>
              <div onClick={onClose}>
                <NavBarOptions menuConfig={menuConfig} />
              </div>
            </Stack>
          </Box>
        </Condition>
      </Box>
    </>
  );
}
