import { OpenAIStream, OpenAIStreamPayload } from "@/utils/openai-stream";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const { repo_name, commit_messages, pull_requests } = (await req.json()) as {
    repo_name: string;
    commit_messages: string[];
    pull_requests: {
      body: string;
      title: string;
    }[];
  };

  if (!repo_name) {
    return new Response(
      "Please select a repository to generate release notes from.",
      { status: 500 }
    );
  }

  try {
    const payload: OpenAIStreamPayload = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
        You are a system for generating what's new, updates, change documentation for software products from their
        Github Commits and Pull requests (PRs) information in their API response formats. 
        Some of the requests you may get may contain only one of them (either commits or PRs)
        You are to ensure that the documentation reflect the changes for the time period specified (if any)
        Let it be organised logically and in simple, easy-to-understand language.`,
        },
        {
          role: "user",
          content: `INSTRUCTIONS:
        In order to generate the needed what's new, updates, change documentation you need the following fields from commits:
        commit.message: This field contains the commit message, which should provide a brief summary of the changes made in the commit. You can use the commit messages to create a brief summary of the changes that have been made since the last release.
        commit.author.name and commit.committer.name: These fields contain the names of the author and committer of the commit, respectively. You can use these names to give credit to the individuals who contributed to the changes.
        commit.author.date and commit.committer.date: These fields contain the dates that the commit was authored and committed, respectively. You can use these dates to provide a timeline of the changes made to the software.
        parents: This field contains an array of parent commit objects, which represent the commits that the current commit was based on. You can use this information to determine the changes made in the current commit relative to its parent commit.
        commit.tree: This field contains the sha of the individual commit, useful for comparing with parents and determining relative position.

        And from PRs:
        title: This field contains the title of the pull request, which typically provides a brief summary of the changes made in the pull request. You can use the title to create a brief summary of the changes that have been made since the last release.
        user.login: This field contains the login name of the user who created the pull request. You can use this information to give credit to the individuals who contributed to the changes.
        body: This field contains the description of the pull request, which provides more details about the changes made. You can use the description to provide a more detailed explanation of the changes that have been made.
        created_at: This field contains the date that the pull request was created. You can use this date to provide a timeline of the changes made to the software.
        html_url: This field contains the URL of the pull request on the GitHub website. You can use this URL to provide a link to the pull request, so that users can view more details about the changes made.

        Then to generate the documentation:
        Combining the information from both the GitHub API for commits and the GitHub API for pull requests can provide a more complete picture of the changes made to your software. Here are some suggestions on how to combine the fields from both APIs to generate a more robust change log:
        Start by retrieving a list of commits made since the last release using the commits API. For each commit, extract the commit.message, commit.author.name, commit.author.date, and parents fields.
        Use the parents field to identify which commits were made relative to which parent commits, so that you can identify the specific changes made in each commit.
        For each commit, check if it is associated with a pull request by searching for the commit SHA in the head.sha field of the pull request API response. If a pull request is found, extract the title, user.login, body, created_at, state, and html_url fields from the pull request response.
        Combine the information from the commits API and the pull requests API to generate a summary of the changes made to your software since the last release. You can use the commit messages to create a brief summary of the changes made, and use the pull request titles and descriptions to provide more detail. You can also use the pull request state (e.g. open, closed, merged) to identify which changes have been merged and which have not.
        Organize the changes by category, such as new features, bug fixes, and performance improvements, to make it easier for users to understand what has changed.
        By combining the information from both APIs, you can generate a more comprehensive change log that includes information about both the individual commits and the pull requests that they are associated with. This can provide a more complete picture of the changes made to your software and make it easier for users to understand what has changed since the last release.
     `,
        },
        {
          role: "user",
          content: `Now, generate the documentation for the following: commit_payload: ${commit_messages}, pr_payload: ${pull_requests}}`,
        },
      ],
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 2048,
      stream: true,
      n: 1,
    };

    const stream = await OpenAIStream(payload);
    return new Response(stream);
  } catch (e: any) {
    console.log({ e });
    return new Response(e, { status: 500 });
  }
}
