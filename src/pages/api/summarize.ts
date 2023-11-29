import { PromptJSONPayload } from "@/types";
import { OpenAIStream, OpenAIStreamPayload } from "@/utils/openai-stream";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const { repo_name, commit_messages, pull_requests } = (await req.json()) as {
    repo_name: string;
    pull_requests: PromptJSONPayload[];
    commit_messages: PromptJSONPayload[];
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
          content: `Your task is to create an easily readable, human-friendly document that presents the software product updates clearly, based on Git commit messages and pull requests data. These data are provided in JSON format and encapsulate the changes that have been made to the software over time.`,
        },
        {
          role: "user",
          content: `
          The goal is to transform this technical jargon into plain language updates that any end user can understand, making it easy for them to know what improvements, fixes or new features have been added. This document will help in increasing user satisfaction, and in turn, improve user retention and engagement.

          In this transformation, ensure the following:

          1. *Translate technical terminology to plain English:* If there's technical jargon or coder-speak in the commit messages or pull requests, translate it into something an average user can understand. Avoid using technical terms and abbreviations that a typical user may not know.

          2. *Group related changes together:* Often, multiple commits or pull requests will relate to the same bug fix or feature update. Group these changes together in your summary so it's clear to a reader what changes were part of the same overall update.

          3. *Highlight the benefits:* Whenever possible, emphasize how the changes benefit the user. For example, instead of saying "Updated database queries for efficiency", say something like "We made changes to make the app run faster and smoother".

          4. *Remove unnecessary details:* Some commit messages and pull requests contain details that are irrelevant to the end user. These should be omitted from the final document.

          5. *Use friendly, engaging language:* Try to keep the tone of the document friendly and engaging. Make the reader feel like this is a conversation, not a dry technical report.

          6. *Structure the document logically:* Start with a brief introduction, followed by the main content - the updates, and conclude with a summary or a look ahead to future updates.

          Consider this example:

          If the JSON data is: 

          json
          {
          "commits": [
            {
              "message": "Fixed a bug causing app crash when user tries to update profile",
              "date": "2023-04-21"
            },
            {
              "message": "Added caching to improve data retrieval speed",
              "date": "2023-04-25"
            }
          ]
          }


          Your corresponding product update might look like:

          ---

          *Software Product Updates*

          Hello Users! 

          We've been busy making some updates to improve your experience:

          *1. Smoother Profile Updates (April 21):* We fixed an issue that was causing the app to crash when you tried to update your profile. Now, you can make changes to your profile with ease!

          *2. Faster App Performance (April 25):* We've made some changes under the hood to make our app run faster. We've added something called 'caching' which helps the app retrieve data quicker, resulting in smoother navigation for you!

          We hope you enjoy these updates! As always, we're continually working to improve the app and make your experience better. Stay tuned for more improvements in the future!

          ---

          The end goal is to ensure that the user feels informed and excited about the improvements to the software product they're using. Good luck!`,
        },
        {
          role: "user",
          content: `
          Below is the Git commit messages and pull requests JSON payload separated by asterisks:
           ******************
           ${JSON.stringify({
             commit_messages,
             pull_requests,
           })}
           ******************

           Make each item of the generated content detailed using more than two or more sentences.
          `,
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
    return new Response(e, { status: 500 });
  }
}
