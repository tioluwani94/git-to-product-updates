import { ContentSection } from "@/components/dashboard/page/content-section";
import { PageContainer } from "@/components/dashboard/page/page-container";
import {
  RadioCard,
  RadioCardGroup,
} from "@/components/layout/radio-card-group";
import { usePage } from "@/hooks/page";
import { useGetTeams } from "@/queries/linear";
import {
  Box,
  Button,
  Container,
  Heading,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function LinearPage() {
  const { data: teams, isLoading: isLoadingTeams } = useGetTeams();

  const {
    summary,
    section,
    setSummary,
    handleNext,
    handlePrevious,
    configPanelRef,
    contentPanelRef,
  } = usePage();

  const [selectedTeam, setSelectedTeam] = useState("");

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
                    <Heading size="xs">Select a space</Heading>
                    {isLoadingTeams ? (
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
                        value={selectedTeam}
                        onChange={(v) => setSelectedTeam(v)}
                      >
                        {teams?.map((s: any) => (
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
                      isDisabled={!selectedTeam}
                    >
                      Next
                    </Button>
                  </Stack>
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
