import { OpenAIStream } from "@/utils/openai-stream";

export const config = {
  runtime: "edge",
};

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export default async function handler(req: Request) {
  const { repo_name, commit_messages } = (await req.json()) as {
    repo_name: string;
    commit_messages: string[];
  };

  if (!repo_name) {
    return new Response("No prompt in the request", { status: 500 });
  }

  try {
    //TODO: Generate prompt for Open AI
    const prompt = `Below is the name of a repository and some commit messages of the repository in an array. \nGenerate a product release note based on the commit message changes, use simple and understandable language. The repository is for a software product.\n Repository name: ${repo_name}\n Commit messages: \n ${commit_messages}`;

    const payload = {
      model: "text-davinci-003",
      prompt,
      temperature: 0.5,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 200,
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
