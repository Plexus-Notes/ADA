// src/services/OpenAIService.ts

import axios from "axios"
import OpenAI from "openai"

export const API_KEY =
  process.env.REACT_APP_OPENAI_API_KEY ?? window.prompt("Whats your openai key?")

//process.env.OPENAI_API_KEY
const openai = API_KEY ? new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true }) : undefined

async function askGPT4(messages: { role: string; content: string }[]): Promise<string | null> {
  if (!openai) return null
  try {

    const completion = await openai.chat.completions.create({
      //@ts-ignore
      messages: messages,
      model: "gpt-4",
    })

    return completion.choices[0].message.content
  } catch (error) {
    console.error("Error calling OpenAI API:", error)
    throw error
  }
}

export { askGPT4 }
