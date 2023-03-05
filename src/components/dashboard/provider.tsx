import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

const DashboardContext = createContext<
  | {
      section: number;
      selectedRepo: any;
      setSection: React.Dispatch<number>;
      setSelectedRepo: React.Dispatch<any>;
    }
  | undefined
>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error(
      "useDashboard must be within a DashboardProvider with a value"
    );
  }
  return context;
};

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [section, setSection] = useState(0);
  const [selectedRepo, setSelectedRepo] = useState<any>();

  const value = useMemo(() => {
    return {
      section,
      setSection,
      selectedRepo,
      setSelectedRepo,
    };
  }, [section, setSection, selectedRepo, setSelectedRepo]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
