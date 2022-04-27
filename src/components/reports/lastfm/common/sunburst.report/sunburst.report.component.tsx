import { Flex, useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import Condition from "../../../../condition/condition.component";
import ReportTitle from "../../../common/report.title/report.title.component";
import type UserState from "../../../../../providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";
import type SunBurstBaseReport from "./sunburst.report.base.class";
import type { TFunction } from "next-i18next";

export interface SunBurstReportProps<T extends UserState<unknown>> {
  report: SunBurstBaseReport<T>;
  t: TFunction;
  userState: T;
  visible: boolean;
}

export default function SunBurstReport<
  UserStateType extends UserState<unknown>
>({ report, t, userState, visible }: SunBurstReportProps<UserStateType>) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t: cardTranslations } = useTranslation("cards"); //TODO: translations specific to this report
  const cardSize = 100;
  const maxWidth = 4 * cardSize + 20;

  if (userState.userProperties.inProgress) return null;

  return (
    <Flex
      style={{
        display: visible ? "inline" : "none",
      }}
      overflowY={"scroll"}
      pt={75}
      pl={50}
      pr={50}
      height={"calc(100vh - 80px)"}
    >
      <Condition isTrue={isOpen}>
        <div>I Dunno Should Something Be Here?</div>
      </Condition>
      <Flex alignItems={"baseline"} justifyContent={"center"}>
        <Flex
          flexWrap={"wrap"}
          justifyContent={"center"}
          alignItems={"center"}
          maxWidth={`${maxWidth}px`}
        >
          <ReportTitle
            title={t(`${String(report.getReportTranslationKey())}.title`)}
            userName={userState.userProperties.userName}
            size={cardSize}
          />
          {userState.userProperties.data.report.playCountByArtist}
        </Flex>
      </Flex>
    </Flex>
  );
}
