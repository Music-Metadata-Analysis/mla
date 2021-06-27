import { voidSetter } from "../../utils/voids";
import { AnalyticsContextInterface } from "../../types/analytics.types";

const InitialValues = <AnalyticsContextInterface>{
  initialized: false,
  setInitialized: voidSetter,
};

export default InitialValues;
