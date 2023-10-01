/* eslint-disable react/no-unescaped-entities */
import DatePicker from "@/components/date-picker";
import {
  CheckboxCard,
  CheckboxCardGroup,
} from "@/components/layout/checkbox-card-group";
import {
  RadioCard,
  RadioCardGroup,
} from "@/components/layout/radio-card-group";
import { Notification } from "@/components/notification";
import {
  getFolderlessLists,
  getFolders,
  getList,
  getSpaces,
  getTasks,
  getTeams,
} from "@/service/clickup";
import {
  ClickUpFolder,
  ClickUpList,
  ClickUpSpace,
  ClickUpTeam,
  ClickupTask,
} from "@/types";
import { contentTypeRegister } from "@/utils/data";
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
  Collapse,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  IconButton,
  Input,
  Link,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteTag,
} from "@choc-ui/chakra-autocomplete";
import { useQuery } from "@tanstack/react-query";
import getUnixTime from "date-fns/getUnixTime";
import { Editor } from "novel";
import { useEffect, useRef, useState } from "react";
import { FiCheckCircle, FiCopy, FiEdit2 } from "react-icons/fi";
import ReactMarkdown from "react-markdown";

export default function ClickupPage() {
  const [section, setSection] = useState(0);
  const [summary, setSummary] = useState("");
  const [statuses, setStatuses] = useState<string[]>([]);
  const [content_type, setContentType] = useState("features");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [product_description, setProductDescription] = useState("");
  const [isGeneratingContent, setIsGeneratingConent] = useState(false);
  const [end_date, setEndDate] = useState<string | undefined>(undefined);
  const [start_date, setStartDate] = useState<string | undefined>(undefined);
  const [selectedList, setSelectedList] = useState<string | undefined>(
    undefined
  );
  const [selectedSpace, setSelectedSpace] = useState<string | undefined>(
    undefined
  );

  const productDescriptionInputRef = useRef<HTMLInputElement>(null);

  const toast = useToast();
  const { onCopy, hasCopied } = useClipboard(summary);

  const { data: teams, isLoading: isLoadingTeams } = useQuery<ClickUpTeam[]>(
    ["clickup-teams"],
    getTeams
  );

  const { data: spaces, isLoading: isLoadingSpaces } = useQuery<ClickUpSpace[]>(
    ["clickup-spaces"],
    () => getSpaces(teams?.[0].id ?? ""),
    {
      enabled: !!teams?.length,
    }
  );

  const { data: folders } = useQuery<ClickUpFolder[]>(
    ["clickup-folders", selectedSpace],
    () => getFolders(selectedSpace ?? ""),
    { enabled: !!selectedSpace }
  );

  const { data: folderslessLists } = useQuery<ClickUpFolder[]>(
    ["clickup-foldersless-lists", selectedSpace],
    () => getFolderlessLists(selectedSpace ?? ""),
    { enabled: !!selectedSpace }
  );

  const { data: list } = useQuery<ClickUpList>(
    ["clickup-list", selectedList],
    () => getList(selectedList ?? ""),
    { enabled: !!selectedList }
  );

  const {
    data: tasks,
    isLoading: isLoadingTasks,
    isFetching: isFetchingTasks,
  } = useQuery<ClickupTask[]>(
    ["clickup-list-task", selectedList, statuses, start_date, end_date],
    () =>
      getTasks(selectedList ?? "", {
        archived: false,
        statuses: statuses,
        date_done_lt: end_date ? getUnixTime(new Date(end_date)) : undefined,
        date_done_gt: start_date
          ? getUnixTime(new Date(start_date))
          : undefined,
      }),
    {
      enabled: !!(selectedList && statuses.length),
    }
  );

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
      console.log(response);
      toast({
        position: "bottom-left",
        render: ({ onClose }) => (
          <Notification message={response.statusText} onClose={onClose} />
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

  const handleEdit = () => {
    setSection(4);
  };

  useEffect(() => {
    if (productDescriptionInputRef.current && section === 2) {
      productDescriptionInputRef.current.focus();
    }
  }, [section]);

  return (
    <Box as="main">
      <Container maxW={section === 4 ? "4xl" : "2xl"} py="8">
        {section === 0 && (
          <Stack spacing="4">
            <Heading size="sm">Select a space</Heading>
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
            <Heading size="sm">Select a list</Heading>
            {!!folders?.length && (
              <Stack>
                <Text color="gray.500" fontWeight="medium" fontSize="xs">
                  Folders
                </Text>

                <Accordion
                  allowMultiple
                  defaultIndex={Array.from({ length: folders.length }).map(
                    (_, i) => i
                  )}
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
                            <RadioCard shadow="xs" value={fl.id} key={fl.id}>
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
                <Text color="gray.500" fontWeight="medium" fontSize="xs">
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
            <Heading size="sm">
              Generate announcement from <Code rounded="md">{list?.name}</Code>{" "}
              list
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
                  onChange={(e) => setProductDescription(e.target.value)}
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
                  Most teams use Closed, Completed, Deployed or Deployed to
                  production
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>
                  Select tasks completed between a date range
                </FormLabel>
                <HStack w="100%">
                  <FormControl>
                    <FormLabel>Start date</FormLabel>
                    <DatePicker
                      value={start_date}
                      inputProps={{ size: "sm" }}
                      disabled={{ after: new Date() }}
                      onChange={(value: any) => setStartDate(value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>End date</FormLabel>
                    <DatePicker
                      value={end_date}
                      inputProps={{ size: "sm" }}
                      disabled={{ after: new Date() }}
                      onChange={(value: any) => setEndDate(value)}
                    />
                  </FormControl>
                </HStack>

                <FormHelperText fontSize="xs">
                  Use this option if your team has a done status setup on
                  Clickup
                </FormHelperText>
              </FormControl>
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
          <Stack spacing="6">
            <Heading size="sm">
              Generate content from <Code rounded="md">{list?.name}</Code> list
            </Heading>

            <Collapse in={!!selectedTasks.length}>
              <Stack
                w="100%"
                spacing={4}
                direction={{ base: "column", md: "row" }}
              >
                <Button
                  size="sm"
                  type="button"
                  onClick={() => {
                    if (!!summary) {
                      setSummary("");
                    } else {
                      handlePrevious();
                    }
                  }}
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
            </Collapse>
            {summary ? (
              <Stack spacing="6" bg="white" p="4" rounded="md">
                <Flex alignItems="center" justifyContent="space-between">
                  <Text fontSize="lg" fontWeight="medium" color="fg.emphasized">
                    Generated content
                  </Text>
                  <Stack direction="row">
                    <Tooltip label="Copy content" aria-label="Copy content">
                      <IconButton
                        isRound
                        size="xs"
                        onClick={onCopy}
                        variant="outline"
                        aria-label="Copy content"
                        icon={hasCopied ? <FiCheckCircle /> : <FiCopy />}
                      />
                    </Tooltip>
                    <Tooltip label="Edit content" aria-label="Edit content">
                      <IconButton
                        isRound
                        size="xs"
                        variant="outline"
                        icon={<FiEdit2 />}
                        onClick={handleEdit}
                        aria-label="Edit content"
                      />
                    </Tooltip>
                  </Stack>
                </Flex>
                <ReactMarkdown
                  components={{
                    a: (props) => (
                      <Link
                        color="#3525e6"
                        target="_blank"
                        href={props.href}
                        rel="noopener noreferrer"
                        style={{
                          ...props.style,
                          color: "#3525e6",
                          fontWeight: 400,
                          wordBreak: "break-word",
                          textDecorationLine: "underline",
                        }}
                      >
                        {props.children}
                      </Link>
                    ),
                    p: ({ children, ...rest }) => (
                      <Text py="2" wordBreak="break-word" color="gray.900">
                        {children}
                      </Text>
                    ),
                    h2: (props) => (
                      <Heading lineHeight="unset" fontSize="lg" {...props} />
                    ),
                  }}
                >
                  {summary}
                </ReactMarkdown>
              </Stack>
            ) : (
              <>
                {tasks && !!tasks.length && (
                  <Stack spacing="6">
                    <Text
                      fontSize="lg"
                      fontWeight="medium"
                      color="fg.emphasized"
                    >
                      Select the tasks you'll like to generate content from
                    </Text>
                    <CheckboxCardGroup
                      spacing="3"
                      value={selectedTasks}
                      onChange={(v) => setSelectedTasks(v as string[])}
                    >
                      {tasks.map((t) => (
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
                              width="350px"
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
                  </Stack>
                )}
              </>
            )}
          </Stack>
        )}
        {section === 4 && (
          <Stack spacing="6">
            <Editor
              defaultValue={summary}
              disableLocalStorage={true}
              className="relative min-h-[500px] w-full max-w-screen-lg border-stone-200 bg-white sm:mb-0 sm:rounded-lg sm:border sm:shadow-md"
            />
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
                onClick={() => {}}
              >
                Share
              </Button>
            </Stack>
          </Stack>
        )}
      </Container>
    </Box>
  );
}

ClickupPage.auth = true;
