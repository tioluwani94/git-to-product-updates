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
  HStack,
  Heading,
  Input,
  Link,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteTag,
} from "@choc-ui/chakra-autocomplete";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function ClickupPage() {
  const [type, setType] = useState("bugs");
  const [section, setSection] = useState(0);
  const [summary, setSummary] = useState("");
  const [end_date, setEndDate] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [start_date, setStartDate] = useState<string[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isGeneratingContent, setIsGeneratingConent] = useState(false);
  const [selectedList, setSelectedList] = useState<string | undefined>(
    undefined
  );
  const [selectedSpace, setSelectedSpace] = useState<string | undefined>(
    undefined
  );

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

  const { data: tasks, isLoading: isLoadingTasks } = useQuery<ClickupTask[]>(
    ["clickup-list-task", selectedList, statuses, start_date, end_date],
    () =>
      getTasks(selectedList ?? "", {
        archived: false,
        statuses: statuses,
        // date_done_lt: getUnixTime(new Date(end_date)),
        // date_done_gt: getUnixTime(new Date(start_date)),
      }),
    {
      enabled: !!selectedList && !!statuses.length,
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
        tasks: tasks
          ?.filter((t) => selectedTasks.includes(t.id))
          .map((t) => ({
            title: t.name,
            description: t.description ?? t.text_content,
          })),
      }),
    });

    if (!response.ok) {
      console.log("error", response.statusText);
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

  return (
    <Box as="main">
      <Container maxW="xl" py="8">
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
            <HStack w="100%">
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
            </HStack>
          </Stack>
        )}
        {section === 2 && (
          <Stack spacing="4">
            <Heading size="sm">
              Generate content from <Code rounded="md">{list?.name}</Code> list
            </Heading>
            <Box>
              <Stack spacing="8">
                <FormControl>
                  <FormLabel color="gray.600">
                    What type of content do you want to create?
                  </FormLabel>
                  <RadioCardGroup
                    w="100%"
                    name="type"
                    value={type}
                    onChange={(v) => setType(v)}
                    direction={{ base: "column", md: "row" }}
                  >
                    {[
                      { value: "bugs", label: "Bug Fixes" },
                      { value: "features", label: "Feature updates" },
                    ].map((i) => (
                      <RadioCard
                        key={i.value}
                        value={i.value}
                        containerProps={{
                          width: { base: "100%", md: "50%" },
                        }}
                      >
                        <Text fontSize="sm" fontWeight="medium">
                          {i.label}
                        </Text>
                      </RadioCard>
                    ))}
                  </RadioCardGroup>
                </FormControl>
                <FormControl>
                  <FormLabel color="gray.600">
                    What status do you use to represent completed tasks?
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
                <HStack>
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
                {isLoadingTasks && !!statuses.length && (
                  <Text>Fetching tasks...</Text>
                )}
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
                      onChange={(v) => setSelectedTasks(v)}
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
                          {/* {statuses.length > 1 && ( */}
                          <Badge
                            mt="2"
                            size="sm"
                            w="fit-content"
                            display="block"
                            bg={t.status.color}
                          >
                            {t.status.status}
                          </Badge>
                          {/* )} */}
                        </CheckboxCard>
                      ))}
                    </CheckboxCardGroup>
                  </Stack>
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
                    order={{ base: 1, md: 2 }}
                    w={{ base: "100%", md: "50%" }}
                    onClick={handleGenerateContent}
                    isLoading={isGeneratingContent}
                    isDisabled={!selectedTasks?.length}
                  >
                    Generate content
                  </Button>
                </Stack>
              </Stack>
            </Box>
            {summary && (
              <Stack bg="white" p="4" rounded="sm">
                <Text fontSize="lg" fontWeight="medium" color="fg.emphasized">
                  Generated content
                </Text>
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
                  }}
                >
                  {summary}
                </ReactMarkdown>
              </Stack>
            )}
          </Stack>
        )}
      </Container>
    </Box>
  );
}

ClickupPage.auth = true;
