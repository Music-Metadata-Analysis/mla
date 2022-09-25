import { Text, Box, Container } from "@chakra-ui/react";
import useColour from "@src/hooks/colour";
import type { SunBurstDrawerNodeComponentProps } from "@src/types/clients/api/lastfm/sunburst.types";

export const testIDs = {
  NodeDisplayText: "NodeDisplayText",
};

export default function SunBurstNodeDisplay({
  node,
  index,
}: SunBurstDrawerNodeComponentProps) {
  const { componentColour } = useColour();

  return (
    <Box
      color={componentColour.foreground}
      bg={componentColour.background}
      p={0}
      mt={1}
      borderWidth={1}
      borderColor={componentColour.border}
    >
      <Container
        m={0}
        p={0}
        overflowWrap={"anywhere"}
        style={{ textIndent: "5px" }}
      >
        <Text data-testid={testIDs.NodeDisplayText} fontSize="sm">
          <strong>{`${index + 1}. `}</strong>
          {node.getNodeName()}
        </Text>
      </Container>
    </Box>
  );
}
