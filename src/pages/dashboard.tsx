import { DashboardProvider } from "@/components/dashboard/provider";
import { RepoSection } from "@/components/dashboard/repo-section";
import { ReposSection } from "@/components/dashboard/repos-section";
import { getTeams } from "@/service/clickup";
import { Container } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { data } = useQuery(["clickup-teams"], getTeams);
  return (
    <DashboardProvider>
      <Container py="2rem" height="100%">
        <ReposSection />
        <RepoSection />
      </Container>
    </DashboardProvider>
  );
}
