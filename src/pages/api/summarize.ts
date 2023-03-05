import { OpenAIStream } from "@/utils/openai-stream";

export const config = {
  runtime: "edge",
};

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export default async function handler(req: Request) {
  const { content } = (await req.json()) as {
    content?: string;
  };

  if (!content) {
    return new Response("No prompt in the request", { status: 500 });
  }

  try {
    //TODO: Generate prompt for Open AI
    const prompt = ``;

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
