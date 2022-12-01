import { Box, Flex, Avatar } from "@chakra-ui/react";
import Option from "./option/report.option.component";
import BillboardContainer from "@src/components/billboard/billboard.base/billboard.container";
import LastFMIconContainer from "@src/components/icons/lastfm/lastfm.icon.container";
import VerticalScrollBarContainer from "@src/components/scrollbars/vertical/vertical.scrollbar.container";
import settings from "@src/config/navbar";
import type { ReportOptionProps } from "./option/report.option.component";
import type { MutableRefObject } from "react";

export interface ReportSelectProps {
  reportOptionProps: ReportOptionProps[];
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  titleText: string;
}

export const ids = {
  LastFMReportSelectScrollArea: "LastFMReportSelectScrollArea",
};

export default function ReportSelect({
  reportOptionProps: reportProps,
  scrollRef,
  titleText,
}: ReportSelectProps) {
  const getMaximumHeight = () => {
    return `calc(100vh - ${settings.offset}px)`;
  };

  return (
    <BillboardContainer titleText={titleText}>
      <Box position={"relative"}>
        <Flex justify={"space-evenly"} align={"center"}>
          <Box mb={1}>
            <Avatar
              icon={<LastFMIconContainer width={100} height={100} />}
              width={[50, 50, 75]}
            />
          </Box>
          <VerticalScrollBarContainer
            horizontalOffset={0}
            scrollRef={scrollRef}
            update={scrollRef.current}
            verticalOffset={0}
          />
          <Box
            className={"scrollbar"}
            id={ids.LastFMReportSelectScrollArea}
            maxHeight={getMaximumHeight()}
            overflow={"scroll"}
            position={"relative"}
            ref={scrollRef}
          >
            <Flex
              direction={"column"}
              justify={"center"}
              align={"center"}
              mb={2}
            >
              {reportProps.map((props, index) => {
                return <Option key={index} {...props} />;
              })}
            </Flex>
          </Box>
        </Flex>
      </Box>
    </BillboardContainer>
  );
}
