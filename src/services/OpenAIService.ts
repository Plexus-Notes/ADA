// src/services/OpenAIService.ts

import axios from "axios"
import OpenAI from "openai"

const API_KEY = "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"

//process.env.OPENAI_API_KEY
const openai = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true })

async function askGPT4(messages: { role: string; content: string }[]): Promise<string | null> {
  try {
    const formattedMessages = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }))

    const completion = await openai.chat.completions.create({
      //@ts-ignore
      messages: formattedMessages,
      model: "gpt-4",
    })

    return completion.choices[0].message.content
  } catch (error) {
    console.error("Error calling OpenAI API:", error)
    throw error
  }
}

export { askGPT4 }
