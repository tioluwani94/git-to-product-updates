import { getRepoCommits, getRepoPullRequests } from "@/service/github";
import { Stack } from "@chakra-ui/react";
import { FormikHelpers } from "formik";
import { useState } from "react";
import { useDashboard } from "../provider";
import * as C from "./components";

export const RepoSection = () => {
  const { section, selectedRepo } = useDashboard();

  const [summary, setSummary] = useState("");

  const handleFormSubmit = async (
    values: C.ConfigurationFormValues,
    formikHelpers: FormikHelpers<C.ConfigurationFormValues>
  ) => {
    setSummary("");
    formikHelpers.setSubmitting(true);

    const repoCommits =
      values.from.includes("commit") &&
      (await getRepoCommits({
        until: values.until,
        repo_name: selectedRepo.name,
      }));

    const repoPullRequests =
      values.from.includes("pr") &&
      (await getRepoPullRequests({
        repo_name: selectedRepo.name,
      }));

    //TODO: Generate content to be sent to Open AI
    const content = "";

    const response = await fetch("/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
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
