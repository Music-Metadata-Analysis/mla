import { Flex, Text, Box, Container } from "@chakra-ui/react";
import { testIDs } from "./node.button.identifiers";
import useColour from "@src/hooks/ui/colour.hook";
import type { SunBurstDrawerNodeComponentProps } from "@src/types/reports/lastfm/components/drawers/sunburst.types";

export default function SunBurstNodeButton({
  node,
  index,
  selectChildNode,
}: SunBurstDrawerNodeComponentProps) {
  const { buttonColour, componentColour } = useColour();

  return (
    <Flex w={"100%"}>
      <Box
        bg={node.getNodeColour()}
        color={componentColour.foreground}
        p={0}
        mt={1}
        borderWidth={1}
        borderColor={componentColour.border}
        w={12}
      >
        <Flex h={"100%"} alignItems={"center"} justifyContent={"center"}>
          <Text data-testid={testIDs.NodeValueText} fontSize="xs">
            {node.getDrawerEntityListPercentage() + "%"}
          </Text>
        </Flex>
      </Box>
      <Box
        _hover={{ bg: buttonColour.hoverBackground }}
        bg={buttonColour.background}
        color={buttonColour.foreground}
        p={0}
        mt={1}
        borderWidth={1}
        borderColor={buttonColour.border}
        onClick={() => selectChildNode(node)}
        cursor={"pointer"}
        w={"100%"}
        justifySelf={"flex-start"}
      >
        <Container
          m={0}
          p={0}
          overflowWrap={"anywhere"}
          style={{ textIndent: "5px" }}
        >
          <Text data-testid={testIDs.NodeNameText} fontSize="sm">
            <strong>{`${index + 1}. `}</strong>
            {node.getNodeName()}
          </Text>
        </Container>
      </Box>
    </Flex>
  );
}
