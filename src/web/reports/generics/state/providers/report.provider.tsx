import React, { useReducer, createContext } from "react";
import InitialValues from "./report.initial";
import { ReportReducer } from "./report.reducer";

export const ReportContext = createContext({ ...InitialValues });

interface ReportProviderProps {
  children: React.ReactNode;
}

const ReportProvider = ({ children }: ReportProviderProps) => {
  const [reportProperties, dispatch] = useReducer(
    ReportReducer,
    InitialValues.reportProperties
  );

  return (
    <ReportContext.Provider
      value={{
        reportProperties,
        dispatch,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export default ReportProvider;
