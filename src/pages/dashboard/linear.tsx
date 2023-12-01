/* eslint-disable react/no-unescaped-entities */
import {
  ActionButtons,
  BackActionButton,
  ConfirmActionButton,
} from "@/components/dashboard/page/action-buttons";
import {
  PageCheckboxCard,
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
import { Notification } from "@/components/notification";
import { usePage } from "@/hooks/page";
import {
  useGetTeam,
  useGetTeamIssueStates,
  useGetTeamIssues,
  useGetTeams,
} from "@/queries/linear";
import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
  Code,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function LinearPage() {
  const [selectedTeam, setSelectedTeam] = useState("");

  const toast = useToast();
  const {
    summary,
    section,
    statuses,
    start_date,
    content_type,
    selectedTasks,
    configPanelRef,
    contentPanelRef,
    isGeneratingContent,
    product_description,
    productDescriptionInputRef,
    setSummary,
    handleNext,
    handlePrevious,
    setSelectedTasks,
    handleGenerateContent,
    handleToggleConfigPanel,
  } = usePage();

  const { data, isLoading: isLoadingTeams } = useGetTeams();
  const { data: team } = useGetTeam(selectedTeam, {
    enabled: !!selectedTeam,
  });
  const { data: statesData } = useGetTeamIssueStates(selectedTeam, {
    enabled: !!selectedTeam,
  });

  const {
    data: tasksData,
    isLoading: isLoadingTasks,
    isFetching: isFetchingTasks,
  } = useGetTeamIssues(
    {
      start_date,
      states: statuses,
      team_id: selectedTeam ?? "",
    },
    {
      enabled: !!(selectedTeam && statuses.length),
      onSuccess: (data) => {
        if (!!data.issues.length) {
          toast({
            position: "bottom-left",
            render: ({ onClose }) => (
              <Notification
                status="success"
                onClose={onClose}
                message={`${data.issues.length} ${
                  data.issues.length > 1 ? "issues" : "issue"
                } retrived`}
              />
            ),
          });
        } else {
          toast({
            position: "bottom-left",
            render: ({ onClose }) => (
              <Notification
                status="error"
                onClose={onClose}
                message="No issues retrived"
              />
            ),
          });
        }
      },
    }
  );

  const tasks = tasksData?.issues;

  const handleGenerateAIContent = () => {
    handleGenerateContent({
      content_type,
      product_description,
      tasks:
        tasks
          ?.filter((t) => selectedTasks.includes(t.id))
          .map((t) => ({
            title: t.title,
            description: t.description,
          })) ?? [],
    });
  };

  useEffect(() => {
    if (productDescriptionInputRef.current && section === 1) {
      productDescriptionInputRef.current.focus();
    }
  }, [productDescriptionInputRef, section]);

  return (
    <PageContainer>
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
                    <Heading size="xs">Select a team</Heading>
                    {isLoadingTeams ? (
                      <LoadingSkeleton />
                    ) : (
                      <RadioCardGroup
                        spacing="3"
                        value={selectedTeam}
                        onChange={(v) => setSelectedTeam(v)}
                      >
                        {data?.teams?.map((team: any) => (
                          <RadioCard shadow="xs" value={team.id} key={team.id}>
                            <Text fontSize="sm" fontWeight="medium">
                              {team.name}
                            </Text>
                          </RadioCard>
                        ))}
                      </RadioCardGroup>
                    )}
                    <ConfirmActionButton
                      w="100%"
                      onClick={handleNext}
                      isDisabled={!selectedTeam}
                    >
                      Next
                    </ConfirmActionButton>
                  </Stack>
                )}
                {section === 1 && (
                  <Stack spacing="4">
                    <Heading size="xs">
                      Generate content for{" "}
                      <Code rounded="md">{team?.name}</Code> team
                    </Heading>
                    <Stack spacing="8">
                      <ContentGenerationConfigForm
                        statusOptions={
                          statesData?.states.map((s) => ({
                            value: s.name,
                            label: s.name,
                            color: s.color,
                          })) ?? []
                        }
                      />
                      <ActionButtons>
                        <BackActionButton onClick={handlePrevious}>
                          Back
                        </BackActionButton>
                        <ConfirmActionButton
                          onClick={handleNext}
                          loadingText="Fetching issues..."
                          isLoading={isLoadingTasks && isFetchingTasks}
                          isDisabled={isLoadingTasks || !product_description}
                        >
                          Next
                        </ConfirmActionButton>
                      </ActionButtons>
                    </Stack>
                  </Stack>
                )}

                {section === 2 && (
                  <>
                    <Stack spacing="6">
                      <Heading size="xs">
                        Generate content for{" "}
                        <Code rounded="md">{team?.name}</Code> team
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
                            Select the issues you'll like to generate content
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
                                  {t.title}
                                </PageCheckboxCardTitle>
                                {t.description && (
                                  <PageCheckboxCardDescription>
                                    {t.description}
                                  </PageCheckboxCardDescription>
                                )}
                                {/* {statuses.length > 1 && (
                                  <PageCheckboxCardBadge bg={t.status.color}>
                                    {t.status.status}
                                  </PageCheckboxCardBadge>
                                )} */}
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
                          <EmptyStateHeading>No Issues</EmptyStateHeading>
                          <EmptyStateText>
                            No issues for the selected configuration{" "}
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

LinearPage.auth = true;
