import { getRepoCommits, getRepoPullRequests } from "@/service/github";
import { Stack } from "@chakra-ui/react";
import { FormikHelpers } from "formik";
import { useState } from "react";
import { useDashboard } from "../provider";
import * as C from "./components";

export const RepoSection = () => {
  const { section, selectedRepo } = useDashboard();

  const [summary, setSummary] = useState("");

  // const { data: repoCommits } = useQuery<any[]>(
  //   ["repo-commits", selectedRepo],
  //   () =>
  //     getRepoCommits({
  //       repo_name: selectedRepo.name,
  //       owner: selectedRepo.owner.login,
  //     }),
  //   {
  //     enabled: !!selectedRepo,
  //   }
  // );

  // const { data: repoPullRequests } = useQuery<any[]>(
  //   ["repo-pull-requests", selectedRepo],
  //   () =>
  //     getRepoPullRequests({
  //       state: "closed",
  //       repo_name: selectedRepo.name,
  //       owner: selectedRepo.owner.login,
  //     }),
  //   {
  //     enabled: !!selectedRepo,
  //   }
  // );

  // console.log({
  //   repoCommits,
  //   repoPullRequests,
  // });

  // console.log({
  //   commits: repoCommits?.map((item: any) => item.commit.message),
  //   pull_requests: repoPullRequests?.map(({ title, body }) => ({
  //     title,
  //     body,
  //   })),
  // });

  const handleFormSubmit = async (
    values: C.ConfigurationFormValues,
    formikHelpers: FormikHelpers<C.ConfigurationFormValues>
  ) => {
    setSummary("");
    formikHelpers.setSubmitting(true);

    const requiresCommit = values.from.includes("commit");
    const requiresPullRequests = values.from.includes("pr");

    const repoCommits =
      requiresCommit &&
      (await getRepoCommits({
        until: values.until,
        repo_name: selectedRepo.name,
        owner: selectedRepo.owner.login,
      }));

    const repoPullRequests =
      requiresPullRequests &&
      (await getRepoPullRequests({
        state: "closed",
        repo_name: selectedRepo.name,
        owner: selectedRepo.owner.login,
      }));

    const commit_messages = !!requiresCommit
      ? repoCommits?.map((item: any) => item.commit.message)
      : undefined;

    const pull_requests = !!requiresPullRequests
      ? repoPullRequests?.map(({ title, body }: any) => ({
          title,
          body,
        }))
      : undefined;

    const response = await fetch("/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pull_requests,
        commit_messages,
        repo_name: selectedRepo.name,
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
    formikHelpers.setSubmitting(false);
  };

  if (section !== 1) {
    return null;
  }

  return (
    <Stack spacing="2rem" alignItems="flex-start">
      <C.Header />
      <Stack spacing="3rem" isInline alignItems="flex-start" width="100%">
        <C.LeftSection />
        <C.RightSection summary={summary} onFormSubmit={handleFormSubmit} />
      </Stack>
    </Stack>
  );
};
