import { Notification } from "@/components/notification";
import { useToast } from "@chakra-ui/react";
import {
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";
import { ImperativePanelHandle } from "react-resizable-panels";

const PageContext = createContext<Context | null>(null);

export const PageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const toast = useToast();
  const configPanelRef = useRef<ImperativePanelHandle>(null);
  const contentPanelRef = useRef<ImperativePanelHandle>(null);
  const productDescriptionInputRef = useRef<HTMLInputElement>(null);

  const [section, setSection] = useState(0);
  const [summary, setSummary] = useState("");
  const [tone, setTone] = useState("formal");
  const [statuses, setStatuses] = useState<string[]>([]);
  const [content_type, setContentType] = useState("features");
  const [writing_length, setWritingLength] = useState("balanced");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [product_description, setProductDescription] = useState("");
  const [isGeneratingContent, setIsGeneratingConent] = useState(false);
  const [start_date, setStartDate] = useState<string | undefined>(undefined);

  const handleNext = () => {
    setSection(section + 1);
  };

  const handlePrevious = () => {
    setSection(section - 1);
  };

  const handleToggleConfigPanel = () => {
    if (configPanelRef.current) {
      const isCollapsed = configPanelRef.current.getCollapsed();
      if (isCollapsed) {
        configPanelRef.current.expand();
      } else {
        configPanelRef.current.collapse();
      }
    }
  };

  const handleGenerateContent = async (payload: {
    content_type: string;
    product_description: string;
    tasks: { title: string; description?: string }[];
  }) => {
    setSummary("");
    setIsGeneratingConent(true);
    const response = await fetch("/api/generate-product-update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      setIsGeneratingConent(false);
      toast({
        position: "bottom-left",
        render: ({ onClose }) => (
          <Notification
            status="error"
            onClose={onClose}
            message={response.statusText}
          />
        ),
      });
      return;
    }
    const data = response.body;
    if (!data) {
      return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setSummary((prev) => prev + chunkValue);
    }
    setIsGeneratingConent(false);
  };

  const contextValue = {
    tone,
    summary,
    section,
    statuses,
    start_date,
    content_type,
    configPanelRef,
    writing_length,
    contentPanelRef,
    selectedTasks,
    product_description,
    isGeneratingContent,
    productDescriptionInputRef,
    setSummary,
    setSection,
    handleNext,
    handlePrevious,
    setContentType,
    setWritingLength,
    setSelectedTasks,
    setProductDescription,
    setIsGeneratingConent,
    setStartDate,
    setStatuses,
    setTone,
    handleToggleConfigPanel,
    handleGenerateContent,
  };

  return (
    <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
  );
};

export const usePage = () => {
  const context = useContext(PageContext);

  if (!context) {
    throw new Error("usePage must be used within PageProvider");
  }

  return context;
};

type Context = {
  tone: string;
  summary: string;
  section: number;
  statuses: string[];
  start_date?: string;
  content_type: string;
  configPanelRef: RefObject<ImperativePanelHandle>;
  writing_length: string;
  contentPanelRef: RefObject<ImperativePanelHandle>;
  selectedTasks: string[];
  product_description: string;
  isGeneratingContent: boolean;
  productDescriptionInputRef: RefObject<HTMLInputElement>;
  setSummary: Dispatch<SetStateAction<string>>;
  setSection: Dispatch<SetStateAction<number>>;
  handleNext: () => void;
  handlePrevious: () => void;
  setContentType: Dispatch<SetStateAction<string>>;
  setWritingLength: Dispatch<SetStateAction<string>>;
  setSelectedTasks: Dispatch<SetStateAction<string[]>>;
  setProductDescription: Dispatch<SetStateAction<string>>;
  setIsGeneratingConent: Dispatch<SetStateAction<boolean>>;
  setStartDate: Dispatch<SetStateAction<string | undefined>>;
  setStatuses: Dispatch<SetStateAction<string[]>>;
  setTone: Dispatch<SetStateAction<string>>;
  handleToggleConfigPanel: () => void;
  handleGenerateContent: (payload: {
    content_type: string;
    product_description: string;
    tasks: { title: string; description?: string }[];
  }) => Promise<void>;
};
