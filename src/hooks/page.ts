import { useRef, useState } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";

export const usePage = () => {
  const configPanelRef = useRef<ImperativePanelHandle>(null);
  const contentPanelRef = useRef<ImperativePanelHandle>(null);

  const [section, setSection] = useState(0);
  const [summary, setSummary] = useState("");

  const handleNext = () => {
    setSection(section + 1);
  };

  const handlePrevious = () => {
    setSection(section - 1);
  };

  return {
    summary,
    section,
    setSummary,
    setSection,
    configPanelRef,
    contentPanelRef,
    handleNext,
    handlePrevious,
  };
};
