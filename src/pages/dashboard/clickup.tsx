/* eslint-disable react/no-unescaped-entities */
import {
  ActionButtons,
  BackActionButton,
  ConfirmActionButton,
} from "@/components/dashboard/page/action-buttons";
import {
  PageCheckboxCard,
  PageCheckboxCardBadge,
  PageCheckboxCardDescription,
  PageCheckboxCardTitle,
} from "@/components/dashboard/page/checkbox-card";
import { PageContainer } from "@/components/dashboard/page/container";
import { ContentSection } from "@/components/dashboard/page/content-section";
import {
  EmptyState,
  EmptyStateButton,
  EmptyStateHeading,
  EmptyStateImage,
  EmptyStateText,
} from "@/components/dashboard/page/empty-state";
import { ContentGenerationConfigForm } from "@/components/dashboard/page/form";
import { LoadingSkeleton } from "@/components/dashboard/page/loading-skeleton";
import { CheckboxCardGroup } from "@/components/layout/checkbox-card-group";
import {
  RadioCard,
  RadioCardGroup,
} from "@/components/layout/radio-card-group";
import { usePage } from "@/hooks/page";
import {
  useGetClickupTeams,
  useGetFolderlessLists,
  useGetFolders,
  useGetList,
  useGetSpaces,
  useGetTasks,
} from "@/queries/clickup";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Code,
  Container,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function ClickupPage() {
  const [selectedList, setSelectedList] = useState<string | undefined>(
    undefined
  );
  const [selectedSpace, setSelectedSpace] = useState<string | undefined>(
    undefined
  );

  const {
    summary,
    section,
    statuses,
    start_date,
    content_type,
    configPanelRef,
    contentPanelRef,
    selectedTasks,
    product_description,
    isGeneratingContent,
    productDescriptionInputRef,
    setSummary,
    handleNext,
    handlePrevious,
    handleToggleConfigPanel,
    setSelectedTasks,
    handleGenerateContent,
  } = usePage();

  const { data: teams, isLoading: isLoadingTeams } = useGetClickupTeams();

  const { data: spaces, isLoading: isLoadingSpaces } = useGetSpaces(
    teams?.[0].id ?? "",
    {
      enabled: !!teams?.length,
    }
  );

  const { data: folders } = useGetFolders(selectedSpace ?? "", {
    enabled: !!selectedSpace,
  });

  const { data: folderslessLists } = useGetFolderlessLists(
    selectedSpace ?? "",
    { enabled: !!selectedSpace }
  );

  const { data: list } = useGetList(selectedList ?? "", {
    enabled: !!selectedList,
  });

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

  const handleGenerateAIContent = () => {
    handleGenerateContent({
      content_type,
      product_description,
      tasks:
        tasks
          ?.filter((t) => selectedTasks.includes(t.id))
          .map((t) => ({
            title: t.name,
            description: t.description ?? t.text_content,
          })) ?? [],
    });
  };

  useEffect(() => {
    if (productDescriptionInputRef.current && section === 2) {
      productDescriptionInputRef.current.focus();
    }
  }, [section, productDescriptionInputRef]);

  return (
    <PageContainer p={8} as="main">
      <Container>
        <PanelGroup
          direction="horizontal"
          className="PanelGroup"
          autoSaveId="dataModelEditor"
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
                      <LoadingSkeleton />
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
                    <ConfirmActionButton
                      w="100%"
                      onClick={handleNext}
                      isDisabled={!selectedSpace}
                    >
                      Next
                    </ConfirmActionButton>
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
                    <ActionButtons>
                      <BackActionButton onClick={handlePrevious}>
                        Back
                      </BackActionButton>
                      <ConfirmActionButton
                        onClick={handleNext}
                        isDisabled={!selectedList}
                      >
                        Next
                      </ConfirmActionButton>
                    </ActionButtons>
                  </Stack>
                )}
                {section === 2 && (
                  <Stack spacing="4">
                    <Heading size="xs">
                      Generate content from{" "}
                      <Code rounded="md">{list?.name}</Code> list
                    </Heading>
                    <Stack spacing="8">
                      <ContentGenerationConfigForm
                        statusOptions={
                          list?.statuses?.map((s) => ({
                            color: s.color,
                            label: s.status,
                            value: s.status,
                          })) ?? []
                        }
                      />
                      <ActionButtons>
                        <BackActionButton onClick={handlePrevious}>
                          Back
                        </BackActionButton>
                        <ConfirmActionButton
                          onClick={handleNext}
                          loadingText="Fetching tasks..."
                          isLoading={isLoadingTasks && isFetchingTasks}
                          isDisabled={isLoadingTasks || !product_description}
                        >
                          Next
                        </ConfirmActionButton>
                      </ActionButtons>
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
                          <ActionButtons>
                            <BackActionButton onClick={handlePrevious}>
                              Back
                            </BackActionButton>
                            <ConfirmActionButton
                              type="submit"
                              isLoading={isGeneratingContent}
                              onClick={handleGenerateAIContent}
                              isDisabled={!selectedTasks?.length}
                            >
                              Generate content
                            </ConfirmActionButton>
                          </ActionButtons>
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
                              <PageCheckboxCard key={t.id} value={t.id}>
                                <PageCheckboxCardTitle>
                                  {t.name}
                                </PageCheckboxCardTitle>
                                {(t.description || t.text_content) && (
                                  <PageCheckboxCardDescription>
                                    {t.description ?? t.text_content}
                                  </PageCheckboxCardDescription>
                                )}
                                {statuses.length > 1 && (
                                  <PageCheckboxCardBadge bg={t.status.color}>
                                    {t.status.status}
                                  </PageCheckboxCardBadge>
                                )}
                              </PageCheckboxCard>
                            ))}
                          </CheckboxCardGroup>
                          <ActionButtons>
                            <BackActionButton onClick={handlePrevious}>
                              Back
                            </BackActionButton>
                            <ConfirmActionButton
                              isLoading={isGeneratingContent}
                              onClick={handleGenerateAIContent}
                              isDisabled={!selectedTasks?.length}
                            >
                              Generate content
                            </ConfirmActionButton>
                          </ActionButtons>
                        </>
                      ) : (
                        <EmptyState>
                          <EmptyStateImage />
                          <EmptyStateHeading>No Tasks</EmptyStateHeading>
                          <EmptyStateText>
                            No tasks for the selected configuration{" "}
                            <span role="img">😔</span>
                          </EmptyStateText>
                          <EmptyStateButton onClick={handlePrevious}>
                            Go back
                          </EmptyStateButton>
                        </EmptyState>
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
