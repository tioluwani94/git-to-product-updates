/* eslint-disable react/no-unescaped-entities */
import { ContentSection } from "@/components/dashboard/clickup/content-section";
import { PageContainer } from "@/components/dashboard/clickup/page-container";
import DatePicker from "@/components/date-picker";
import {
  CheckboxCard,
  CheckboxCardGroup,
} from "@/components/layout/checkbox-card-group";
import {
  RadioButton,
  RadioButtonGroup,
} from "@/components/layout/radio-button-group";
import {
  RadioCard,
  RadioCardGroup,
} from "@/components/layout/radio-card-group";
import { Notification } from "@/components/notification";
import {
  useGetClickupTeams,
  useGetFolderlessLists,
  useGetFolders,
  useGetList,
  useGetSpaces,
  useGetTasks,
} from "@/queries/clickup";
import { TONES, WRITING_LENGTH, contentTypeRegister } from "@/utils/data";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Code,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Skeleton,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteTag,
} from "@choc-ui/chakra-autocomplete";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ImperativePanelHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";

export default function ClickupPage() {
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
  const [selectedList, setSelectedList] = useState<string | undefined>(
    undefined
  );
  const [selectedSpace, setSelectedSpace] = useState<string | undefined>(
    undefined
  );

  const configPanelRef = useRef<ImperativePanelHandle>(null);
  const contentPanelRef = useRef<ImperativePanelHandle>(null);
  const productDescriptionInputRef = useRef<HTMLInputElement>(null);

  const toast = useToast();

  const { data: teams, isLoading: isLoadingTeams } = useGetClickupTeams();

  const { data: spaces, isLoading: isLoadingSpaces } = useGetSpaces(
    teams?.[0].id ?? "",
    {
      enabled: !!teams?.length,
    }
  );

  const { data: folders } = useGetFolders(selectedSpace ?? "");

  const { data: folderslessLists } = useGetFolderlessLists(selectedSpace ?? "");

  const { data: list } = useGetList(selectedList ?? "");

  const {
    data: tasks,
    isLoading: isLoadingTasks,
    isFetching: isFetchingTasks,
  } = useGetTasks(
    {
      statuses,
      start_date,
      selectedList: selectedList ?? "",
    },
    {
      enabled: !!(selectedList && statuses.length),
    }
  );

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

  const handleGenerateContent = async () => {
    setSummary("");
    setIsGeneratingConent(true);
    const response = await fetch("/api/clickup/generate-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content_type,
        product_description,
        tasks: tasks
          ?.filter((t) => selectedTasks.includes(t.id))
          .map((t) => ({
            title: t.name,
            description: t.description ?? t.text_content,
          })),
      }),
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

  const handleNext = () => {
    setSection(section + 1);
  };

  const handlePrevious = () => {
    setSection(section - 1);
  };

  useEffect(() => {
    if (productDescriptionInputRef.current && section === 2) {
      productDescriptionInputRef.current.focus();
    }
  }, [section]);

  return (
    <PageContainer p={8} as="main">
      <Container>
        <PanelGroup
          direction="horizontal"
          autoSaveId="dataModelEditor"
          className="PanelGroup"
        >
          <Panel
            defaultSize={40}
            className="Panel"
            collapsible={true}
            ref={configPanelRef}
          >
            <Box h="640px" overflowY="auto">
              <Container>
                {section === 0 && (
                  <Stack spacing="4">
                    <Heading size="xs">Select a space</Heading>
                    {isLoadingTeams || isLoadingSpaces ? (
                      <Stack spacing="3">
                        {Array.from({ length: 8 }, (v, i) => (
                          <Skeleton
                            h="45px"
                            key={`${i}`}
                            rounded="md"
                            endColor="gray.200"
                            startColor="gray.100"
                          />
                        ))}
                      </Stack>
                    ) : (
                      <RadioCardGroup
                        spacing="3"
                        value={selectedSpace}
                        onChange={(v) => setSelectedSpace(v)}
                      >
                        {spaces?.map((s) => (
                          <RadioCard shadow="xs" value={s.id} key={s.id}>
                            <Text fontSize="sm" fontWeight="medium">
                              {s.name}
                            </Text>
                          </RadioCard>
                        ))}
                      </RadioCardGroup>
                    )}
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={handleNext}
                      isDisabled={!selectedSpace}
                    >
                      Next
                    </Button>
                  </Stack>
                )}
                {section === 1 && (
                  <Stack spacing="4">
                    <Heading size="xs">Select a list</Heading>
                    {!!folders?.length && (
                      <Stack>
                        <Text
                          color="gray.500"
                          fontWeight="medium"
                          fontSize="xs"
                        >
                          Folders
                        </Text>

                        <Accordion
                          allowMultiple
                          defaultIndex={Array.from({
                            length: folders.length,
                          }).map((_, i) => i)}
                        >
                          {folders?.map((f) => (
                            <AccordionItem key={f.id} borderTopWidth="0">
                              <AccordionButton px="1">
                                <Box as="span" flex="1" textAlign="left">
                                  {f.name} folder
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                              <AccordionPanel pb={4} px="1">
                                <RadioCardGroup
                                  spacing="3"
                                  value={selectedList}
                                  onChange={(v) => setSelectedList(v)}
                                >
                                  {f.lists?.map((fl) => (
                                    <RadioCard
                                      shadow="xs"
                                      value={fl.id}
                                      key={fl.id}
                                    >
                                      <Text fontSize="sm" fontWeight="medium">
                                        {fl.name}
                                      </Text>
                                    </RadioCard>
                                  ))}
                                </RadioCardGroup>
                              </AccordionPanel>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </Stack>
                    )}
                    {!!folderslessLists?.length && (
                      <Stack>
                        <Text
                          color="gray.500"
                          fontWeight="medium"
                          fontSize="xs"
                        >
                          Lists
                        </Text>
                        <RadioCardGroup
                          spacing="3"
                          value={selectedList}
                          onChange={(v) => setSelectedList(v)}
                        >
                          {folderslessLists?.map((fll) => (
                            <RadioCard shadow="xs" value={fll.id} key={fll.id}>
                              <Text fontSize="sm" fontWeight="medium">
                                {fll.name}
                              </Text>
                            </RadioCard>
                          ))}
                        </RadioCardGroup>
                      </Stack>
                    )}
                    <Stack w="100%" direction={{ base: "column", md: "row" }}>
                      <Button
                        size="sm"
                        onClick={handlePrevious}
                        order={{ base: 2, md: 1 }}
                        w={{ base: "100%", md: "50%" }}
                      >
                        Back
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={handleNext}
                        isDisabled={!selectedList}
                        order={{ base: 1, md: 2 }}
                        w={{ base: "100%", md: "50%" }}
                      >
                        Next
                      </Button>
                    </Stack>
                  </Stack>
                )}
                {section === 2 && (
                  <Stack spacing="4">
                    <Heading size="xs">
                      Generate announcement from{" "}
                      <Code rounded="md">{list?.name}</Code> list
                    </Heading>
                    <Stack spacing="8">
                      <FormControl>
                        <FormLabel>
                          Give a short description on what your product is
                        </FormLabel>
                        <Input
                          size="sm"
                          type="text"
                          value={product_description}
                          ref={productDescriptionInputRef}
                          onChange={(e) =>
                            setProductDescription(e.target.value)
                          }
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel color="gray.600">
                          What type of content do you want to create?
                        </FormLabel>
                        <RadioCardGroup
                          w="100%"
                          name="type"
                          value={content_type}
                          onChange={(v) => setContentType(v)}
                          direction={{ base: "column", md: "row" }}
                        >
                          {Object.keys(contentTypeRegister).map((k) => (
                            <RadioCard
                              key={k}
                              value={k}
                              containerProps={{
                                width: { base: "100%", md: "50%" },
                              }}
                            >
                              <Text fontSize="sm" fontWeight="medium">
                                {contentTypeRegister[k]}
                              </Text>
                            </RadioCard>
                          ))}
                        </RadioCardGroup>
                      </FormControl>
                      <FormControl>
                        <FormLabel color="gray.600">
                          What status do you use to represent done tasks?
                        </FormLabel>
                        <AutoComplete
                          multiple
                          openOnFocus
                          closeOnSelect
                          value={statuses}
                          restoreOnBlurIfEmpty={false}
                          onChange={(vals) => setStatuses(vals)}
                        >
                          <AutoCompleteInput
                            size="sm"
                            rounded="sm"
                            variant="filled"
                            borderColor="gray.200"
                            placeholder="Select status"
                            sx={{
                              ".chakra-input__group": {
                                w: "auto",
                              },
                              ".chakra-wrap__list": {
                                alignItems: "center",
                              },
                            }}
                          >
                            {({ tags }) =>
                              tags.map((tag, tid) => (
                                <AutoCompleteTag
                                  key={tid}
                                  label={tag.label}
                                  alignItems="center"
                                  onRemove={tag.onRemove}
                                />
                              ))
                            }
                          </AutoCompleteInput>
                          <AutoCompleteList py="2">
                            {list?.statuses?.map((s, id) => (
                              <AutoCompleteItem
                                bg="fg.muted"
                                align="center"
                                value={s.status}
                                key={`option-${id}`}
                                textTransform="capitalize"
                              >
                                <Box rounded="full" boxSize="2" bg={s.color} />
                                <Text ml="4">{s.status}</Text>
                              </AutoCompleteItem>
                            ))}
                          </AutoCompleteList>
                        </AutoComplete>
                        <FormHelperText fontSize="xs">
                          Most teams use Closed, Completed or Deployed
                        </FormHelperText>
                      </FormControl>
                      <FormControl>
                        <FormLabel>
                          Select tasks completed starting from this date
                        </FormLabel>
                        <DatePicker
                          value={start_date}
                          inputProps={{ size: "sm" }}
                          disabled={{ after: new Date() }}
                          onChange={(value: any) => setStartDate(value)}
                        />
                        <FormHelperText fontSize="xs">
                          Use this option if your team has a done status setup
                          on Clickup
                        </FormHelperText>
                      </FormControl>
                      <FormControl>
                        <FormLabel color="gray.600">Tone</FormLabel>
                        <RadioButtonGroup
                          size="sm"
                          value={tone}
                          onChange={(v) => setTone(v)}
                        >
                          {TONES.map((t) => (
                            <RadioButton value={t.value} key={t.value}>
                              {t.label}
                            </RadioButton>
                          ))}
                        </RadioButtonGroup>
                      </FormControl>
                      {content_type === "features" && (
                        <FormControl>
                          <FormLabel color="gray.600">Writing length</FormLabel>

                          <RadioButtonGroup
                            size="sm"
                            value={writing_length}
                            onChange={(v) => setWritingLength(v)}
                          >
                            {WRITING_LENGTH.map((t) => (
                              <RadioButton value={t.value} key={t.value}>
                                {t.label}
                              </RadioButton>
                            ))}
                          </RadioButtonGroup>
                        </FormControl>
                      )}
                      <Stack w="100%" direction={{ base: "column", md: "row" }}>
                        <Button
                          size="sm"
                          type="button"
                          onClick={handlePrevious}
                          order={{ base: 2, md: 1 }}
                          w={{ base: "100%", md: "50%" }}
                        >
                          Back
                        </Button>
                        <Button
                          size="sm"
                          type="submit"
                          colorScheme="blue"
                          onClick={handleNext}
                          order={{ base: 1, md: 2 }}
                          loadingText="Fetching tasks..."
                          w={{ base: "100%", md: "50%" }}
                          isLoading={isLoadingTasks && isFetchingTasks}
                          isDisabled={isLoadingTasks || !product_description}
                        >
                          Next
                        </Button>
                      </Stack>
                    </Stack>
                  </Stack>
                )}
                {section === 3 && (
                  <>
                    <Stack spacing="6">
                      <Heading size="xs">
                        Generate content from{" "}
                        <Code rounded="md">{list?.name}</Code> list
                      </Heading>

                      {tasks?.length ? (
                        <>
                          <Stack
                            w="100%"
                            spacing={4}
                            direction={{ base: "column", md: "row" }}
                          >
                            <Button
                              size="sm"
                              type="button"
                              onClick={handlePrevious}
                              order={{ base: 2, md: 1 }}
                              w={{ base: "100%", md: "50%" }}
                            >
                              Back
                            </Button>
                            <Button
                              size="sm"
                              type="submit"
                              colorScheme="blue"
                              order={{ base: 1, md: 2 }}
                              w={{ base: "100%", md: "50%" }}
                              onClick={handleGenerateContent}
                              isLoading={isGeneratingContent}
                              isDisabled={!selectedTasks?.length}
                            >
                              Generate content
                            </Button>
                          </Stack>
                          <Text
                            fontSize="lg"
                            fontWeight="medium"
                            color="fg.emphasized"
                          >
                            Select the tasks you'll like to generate content
                            from
                          </Text>
                          <CheckboxCardGroup
                            spacing="3"
                            value={selectedTasks}
                            onChange={(v) => setSelectedTasks(v as string[])}
                          >
                            {tasks?.map((t) => (
                              <CheckboxCard key={t.id} value={t.id}>
                                <Text
                                  mb="2"
                                  fontSize="sm"
                                  fontWeight="medium"
                                  color="fg.emphasized"
                                >
                                  {t.name}
                                </Text>
                                {(t.description || t.text_content) && (
                                  <Text
                                    mt="2"
                                    width="250px"
                                    textStyle="sm"
                                    color="fg.muted"
                                    overflow="hidden"
                                    whiteSpace="nowrap"
                                    textOverflow="ellipsis"
                                  >
                                    {t.description ?? t.text_content}
                                  </Text>
                                )}
                                {statuses.length > 1 && (
                                  <Badge
                                    mt="2"
                                    size="sm"
                                    color="white"
                                    w="fit-content"
                                    display="block"
                                    bg={t.status.color}
                                  >
                                    {t.status.status}
                                  </Badge>
                                )}
                              </CheckboxCard>
                            ))}
                          </CheckboxCardGroup>
                          <Stack
                            w="100%"
                            spacing={4}
                            direction={{ base: "column", md: "row" }}
                          >
                            <Button
                              size="sm"
                              type="button"
                              onClick={handlePrevious}
                              order={{ base: 2, md: 1 }}
                              w={{ base: "100%", md: "50%" }}
                            >
                              Back
                            </Button>
                            <Button
                              size="sm"
                              type="submit"
                              colorScheme="blue"
                              order={{ base: 1, md: 2 }}
                              w={{ base: "100%", md: "50%" }}
                              onClick={handleGenerateContent}
                              isLoading={isGeneratingContent}
                              isDisabled={!selectedTasks?.length}
                            >
                              Generate content
                            </Button>
                          </Stack>
                        </>
                      ) : (
                        <VStack pt={20} h="100%" justifyContent="center">
                          <Image
                            width={100}
                            height={100}
                            alt="task done"
                            src="/images/no-task.png"
                          />
                          <Heading
                            fontSize="lg"
                            lineHeight="unset"
                            textAlign="center"
                          >
                            No Tasks
                          </Heading>
                          <Text
                            textAlign="center"
                            color="gray.500"
                            fontSize="sm"
                          >
                            No tasks for the selected configuration{" "}
                            <span role="img">😔</span>
                          </Text>
                          <Button
                            size="sm"
                            type="button"
                            onClick={handlePrevious}
                            order={{ base: 2, md: 1 }}
                          >
                            Go back
                          </Button>
                        </VStack>
                      )}
                    </Stack>
                  </>
                )}
              </Container>
            </Box>
          </Panel>
          <PanelResizeHandle className="ResizeHandleOuter">
            <div className="ResizeHandleInner">
              <svg className="Icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M8,18H11V15H2V13H22V15H13V18H16L12,22L8,18M12,2L8,6H11V9H2V11H22V9H13V6H16L12,2Z"
                />
              </svg>
            </div>
          </PanelResizeHandle>
          <Panel
            className="Panel"
            defaultSize={60}
            collapsible={true}
            ref={contentPanelRef}
          >
            <Box h="640px" overflowY="auto" color="gray.900">
              <ContentSection
                content={summary}
                onChangeContent={setSummary}
                onToggleConfigPanel={handleToggleConfigPanel}
              />
            </Box>
          </Panel>
        </PanelGroup>
      </Container>
    </PageContainer>
  );
}

ClickupPage.auth = true;
