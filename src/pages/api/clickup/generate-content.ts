import { contentTypeRegister, promptGenerator } from "@/utils/data";
import { OpenAIStream, OpenAIStreamPayload } from "@/utils/openai-stream";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request, res: Response) {
  const { content_type, tasks, product_description, tone, writing_length } =
    await req.json();

  if (!tasks) {
    return new Response("Please select a tasks to generate content from.", {
      status: 500,
    });
  }

  try {
    const payload: OpenAIStreamPayload = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: promptGenerator({
            tone,
            tasks,
            content_type,
            writing_length,
            product_description,
          }),
        },
      ],
      temperature: 0.2,
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
    return new Response(e, { status: 500 });
  }
}
