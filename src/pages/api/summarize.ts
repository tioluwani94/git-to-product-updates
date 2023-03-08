import { OpenAIStream } from "@/utils/openai-stream";

export const config = {
  runtime: "edge",
};

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export default async function handler(req: Request) {
  let prompt: string;
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

  if (commit_messages && pull_requests) {
    prompt = `Below is the name of a repository and some commit messages as well as pull requests information of the repository in an array. \nGenerate a product release note based on the commit message changes and pull requests information, use simple and understandable language. The repository is for a software product.\n Repository name: ${repo_name}\n Commit messages: \n ${commit_messages} \n Pull requests: \n ${pull_requests}`;
  } else if (pull_requests) {
    prompt = `Below is the name of a repository and some pull requests of the repository in an array. \nGenerate a product release note based on the pull requests information, use simple and understandable language. The repository is for a software product.\n Repository name: ${repo_name}\n Pull requests: \n ${pull_requests}`;
  } else {
    prompt = `Below is the name of a repository and some commit messages of the repository in an array. \nGenerate a product release note based on the commit message changes, use simple and understandable language. The repository is for a software product.\n Repository name: ${repo_name}\n Commit messages: \n ${commit_messages}`;
  }

  try {
    const payload = {
      n: 1,
      prompt,
      top_p: 1,
      stream: true,
      max_tokens: 200,
      temperature: 0.5,
      presence_penalty: 0,
      frequency_penalty: 0,
      model: "text-davinci-003",
    };

    const stream = await OpenAIStream(payload);
    return new Response(stream);
  } catch (e: any) {
    console.log({ e });
    return new Response(e, { status: 500 });
  }
}
