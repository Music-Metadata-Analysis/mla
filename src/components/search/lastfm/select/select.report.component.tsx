import { Box, Flex, Avatar } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { MutableRefObject, useEffect, useState } from "react";
import Option from "./inlay/select.option.component";
import config from "../../../../config/lastfm";
import settings from "../../../../config/navbar";
import useFlags from "../../../../hooks/flags";
import Billboard from "../../../billboard/billboard.component";
import LastFMIcon from "../../../icons/lastfm/lastfm.icon";
import VerticalScrollBarComponent from "../../../scrollbar/vertical.scrollbar.component";

export interface SearchSelectionProps {
  scrollRef: MutableRefObject<HTMLDivElement | null>;
}

export default function SearchSelection({ scrollRef }: SearchSelectionProps) {
  const { t } = useTranslation("lastfm");
  const router = useRouter();
  const [visibleIndicators, setVisibleIndicators] = useState(true);
  const flags = useFlags();

  const getMaximumHeight = () => {
    return `calc(100vh - ${settings.offset}px)`;
  };

  const enabledReports = () => {
    let enabled = config.select.options;
    enabled = enabled.filter((option) => {
      return flags.isEnabled(option.flag);
    });
    return enabled;
  };

  const hideIndicators = () => {
    if (window.innerWidth < config.select.indicatorWidth) {
      setVisibleIndicators(false);
    } else {
      setVisibleIndicators(true);
    }
  };

  useEffect(() => {
    hideIndicators();
    window.addEventListener("resize", hideIndicators);
    return () => {
      window.removeEventListener("resize", hideIndicators);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Billboard title={t("select.title")}>
      <Box position={"relative"}>
        <Flex justify={"space-evenly"} align={"center"}>
          <Box mb={1}>
            <Avatar
              icon={<LastFMIcon width={100} height={100} />}
              width={[50, 50, 75]}
            />
          </Box>
          <VerticalScrollBarComponent
            horizontalOffset={0}
            scrollRef={scrollRef}
            update={null}
            verticalOffset={0}
          />
          <Box
            className={"scrollbar"}
            id={"SunburstDrawerEntityListScrollArea"}
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
              {enabledReports().map((option, index) => {
                return (
                  <Option
                    key={index}
                    analyticsName={option.analyticsName}
                    buttonText={t(option.buttonTextKey)}
                    clickHandler={() => router.push(option.route)}
                    indicatorText={t(option.indicatorTextKey)}
                    visibleIndicators={visibleIndicators}
                  />
                );
              })}
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Billboard>
  );
}
