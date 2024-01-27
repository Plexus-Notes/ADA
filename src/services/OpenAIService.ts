// src/services/OpenAIService.ts

import axios from "axios"
import OpenAI from "openai"
import { createPullRequest } from "../components/AdaGithubPR/adagithub";

export const API_KEY =
  process.env.REACT_APP_OPENAI_API_KEY ?? window.prompt("Whats your openai key?")

//process.env.OPENAI_API_KEY
let openai = API_KEY ? new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true }) : undefined

const tools: any = [
  {
    type: "function",
    function: {
      name: "createPullRequest",
      description: "Create a Pull request with a given description",
      parameters: {
        type: "object",
        properties: {
          branchName: {
            type: "string",
            description: "The name of the branch for the pull request based on what the pull request is trying to do.",
          },
          title: {
            type: "string",
            description: "The title of the pull request based on what the pull request does.",
          },
          body: {
            type: 'string',
            descrption: 'The kind of changes that need to be made for a file. Always make it start with Generate a file that does... and fill in the rest'
          }
        },
        required: ["branchName", "title", "body"],
      },
    },
  },
];


async function askGPT4(messages: { role: string; content: string }[], noTools?: boolean): Promise<string | null> {
  if (!openai)  {
    openai = API_KEY ? new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true }) : undefined
  }
  if (!openai)  {
  return null
  }

  try {
    const formattedMessages: any = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }))

    const completion = noTools ? await  openai.chat.completions.create({
      messages: formattedMessages,
      model: "gpt-4",
      tools: tools,
      tool_choice: 'auto'
    }) : 
    await openai.chat.completions.create({
      messages: formattedMessages,
      model: "gpt-4",
    })

    const toolCalls = completion.choices[0].message.tool_calls;

    if (toolCalls && noTools) {
      // const availableFunctions = {
      //   createPullRequest: createPullRequest,
      // }; 
      // for (const toolCall of toolCalls) {
        const functionName = toolCalls[0].function.name;
        // const functionToCall = availableFunctions[functionName];
        const functionToCall = createPullRequest
        const functionArgs = JSON.parse(toolCalls[0].function.arguments);
        const functionResponse = functionToCall(
          'adaIsSoCool',
          'ADA',
          functionArgs.branchName + '12',
          functionArgs.title,
          functionArgs.body
        );
        const result = await functionResponse
        return (typeof result === 'string') ? result : 'Failed to create a PR'
      // }
    }

    return completion.choices[0].message.content
  } catch (error) {
    console.error("Error calling OpenAI API:", error)
    throw error
  }
}

export { askGPT4 }
