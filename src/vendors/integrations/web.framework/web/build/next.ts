import { PHASE_PRODUCTION_BUILD } from "next/constants";

const isNextBuildTime = () => {
  return process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;
};

export default isNextBuildTime;
