import {
  RadioCard,
  RadioCardGroup,
} from "@/components/layout/radio-card-group";
import { useAuth } from "@/hooks/auth";
import {
  getFolderlessLists,
  getFolders,
  getList,
  getSpaces,
  getTeams,
} from "@/service/clickup";
import { ClickUpFolder, ClickUpList, ClickUpSpace, ClickUpTeam } from "@/types";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Code,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import React, { useState } from "react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteTag,
} from "@choc-ui/chakra-autocomplete";

export default function ClickupPage() {
  useAuth();

  const [section, setSection] = useState(0);
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

  const { values, handleSubmit, handleChange, setFieldValue } = useFormik({
    onSubmit: console.log,
    initialValues: {
      type: "bugs",
      statuses: [],
    },
  });

  const handleNext = () => {
    setSection(section + 1);
  };

  const handlePrevious = () => {
    setSection(section - 1);
  };

  return (
    <Box as="main">
      <Container maxW="lg" py="8">
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
          <form onSubmit={handleSubmit}>
            <Stack spacing="4">
              <Heading size="sm">
                Generate content from <Code rounded="md">{list?.name}</Code>{" "}
                list
              </Heading>
              <Stack spacing="8">
                <FormControl>
                  <FormLabel color="gray.600">
                    What type of content do you want to create?
                  </FormLabel>
                  <RadioCardGroup
                    w="100%"
                    name="type"
                    value={values.type}
                    direction={{ base: "column", md: "row" }}
                    onChange={(v) => setFieldValue("type", v)}
                  >
                    {[
                      { value: "bugs", label: "Bug Fixes" },
                      { value: "features", label: "Feature updates" },
                    ].map((i) => (
                      <RadioCard
                        key={i.value}
                        value={i.value}
                        containerProps={{ width: { base: "100%", md: "50%" } }}
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
                    value={values.statuses}
                    restoreOnBlurIfEmpty={false}
                    onChange={(vals) =>
                      setFieldValue("instructions.language", vals.join())
                    }
                  >
                    <AutoCompleteInput
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
                <HStack w="100%">
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
                  >
                    Generate content
                  </Button>
                </HStack>
              </Stack>
            </Stack>
          </form>
        )}
      </Container>
    </Box>
  );
}
