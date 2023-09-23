import { DashboardProvider } from "@/components/dashboard/provider";
import { RepoSection } from "@/components/dashboard/repo-section";
import { ReposSection } from "@/components/dashboard/repos-section";
import { Container } from "@chakra-ui/react";

export default function Dashboard() {
  return (
    <DashboardProvider>
      <Container py="2rem" height="100%">
        <ReposSection />
        <RepoSection />
      </Container>
    </DashboardProvider>
  );
}

Dashboard.auth = true;
