import { OpenAIStream, OpenAIStreamPayload } from "@/utils/openai-stream";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request, res: Response) {
  const { tasks } = await req.json();

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
          role: "user",
          content: `
          Using the provided JSON data containing tasks for a B2B SaaS product, generate a detailed product update document for each task. Each update should:
    
          1. Start with the task title as a heading.
          2. Follow with a detailed explanation based on the task description, incorporating the feature's importance, how users can access it, and the benefits or improvements it brings to the system.
          3. Ensure that the language used is formal and suitable for a B2B audience.
          4. Provide any relevant instructions or steps to utilize the new feature if necessary.
          
          For example, if the task is:
          {
            "title": "Project templates",
            "description": "You can now create standard templates for projects. You'll be able to define basic details such as the project name, description, lead, project members, project status, and associated roadmaps..."
          }
          
          The output should be:
          "Project templates"
          You can now create standard templates for projects. You'll be able to define basic details such as the project name, description, lead, project members, project status, and associated roadmaps. To create or edit a project template, go to the Templates section in your team or workspace settings. When you initiate a new project, you'll have the option to apply one of these templates from the project creation modal, in the same way you do for issue templates.
    
          Here's the JSON data separated by asterisks:
          ******************
          ${JSON.stringify({
            tasks,
          })}
          ******************    
        `,
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
    console.log({ e });
    return new Response(e, { status: 500 });
  }
}
