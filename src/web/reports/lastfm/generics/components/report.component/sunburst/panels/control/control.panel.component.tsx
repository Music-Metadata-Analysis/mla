import { Flex, Box } from "@chakra-ui/react";
import { testIDs } from "./control.panel.identifiers";
import SunBurstDetailsPanel from "@src/web/reports/lastfm/generics/components/report.component/sunburst/panels/details/details.panel.component";
import useColour from "@src/web/ui/colours/state/hooks/colour.hook";
import ButtonWithoutAnalytics from "@src/web/ui/generics/components/buttons/button.base/button.base.component";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";
import type { d3Node } from "@src/web/reports/generics/types/state/charts/sunburst.types";
import type SunBurstNodeAbstractBase from "@src/web/reports/lastfm/generics/components/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";

export interface SunBurstControlPanelProps {
  setSelectedNode: (node: d3Node) => void;
  isOpen: boolean;
  openDrawer: () => void;
  breakPoints: Array<number>;
  lastFMt: tFunctionType;
  node: SunBurstNodeAbstractBase;
}

export default function SunBurstControlPanel({
  breakPoints,
  isOpen,
  node,
  openDrawer,
  setSelectedNode,
  lastFMt,
}: SunBurstControlPanelProps) {
  const { componentColour } = useColour();

  const getControlButtonLabel = () => {
    if (node.hasLeafChildren())
      return lastFMt("playCountByArtist.panel.leafNodeControl");
    return lastFMt("playCountByArtist.panel.control");
  };

  return (
    <Box
      borderWidth={2}
      borderColor={componentColour.border}
      bg={componentColour.background}
      color={componentColour.foreground}
      w={breakPoints}
    >
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <SunBurstDetailsPanel
          breakPoints={breakPoints}
          lastFMt={lastFMt}
          nodeName={node.getNodeName()}
          nodeParentName={node.getParentName()}
          nodeValue={node.getValue()}
        />
        <Flex flexDirection={"column"}>
          <ButtonWithoutAnalytics
            data-testid={testIDs.SunBurstControlPanelBack}
            ml={2}
            mr={2}
            mt={2}
            mb={2}
            size={"xs"}
            onClick={() => setSelectedNode(node.getParent() as d3Node)}
            width={50}
            isDisabled={!node.getParent() || isOpen}
          >
            {"\u25B2"}
          </ButtonWithoutAnalytics>
          <ButtonWithoutAnalytics
            data-testid={testIDs.SunBurstControlPanelSelect}
            ml={2}
            mr={2}
            mt={2}
            mb={2}
            size={"xs"}
            onClick={openDrawer}
            width={50}
            isDisabled={isOpen}
          >
            {getControlButtonLabel()}
          </ButtonWithoutAnalytics>
        </Flex>
      </Flex>
    </Box>
  );
}
