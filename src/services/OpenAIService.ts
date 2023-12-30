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
    const formattedMessages = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }))

    const completion = await openai.chat.completions.create({
      //@ts-ignore
      messages: formattedMessages,
      model: "gpt-3.5-turbo",
    })

    return completion.choices[0].message.content
  } catch (error) {
    console.error("Error calling OpenAI API:", error)
    throw error
  }
}


async function shouldITextYet(messages: { role: string; content: string }[]): Promise<string | null> {
  
 if (!openai) return null
  try {
    const formattedMessages = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }))

    const completion = await openai.chat.completions.create({
      //@ts-ignore
      messages: formattedMessages,
      model: "gpt-3.5-turbo",
    })

    let content = completion.choices[0].message.content;
    if (content == "NO" || content == "no" || content == "No" || content == "nO" || content == "n" || content == "N" || content == "No." || content == "NO.") {
      return null;
    }
    return content; 
  } catch (error) {
    console.error("Error calling OpenAI API:", error)
    throw error
  }
}
 
  


export { askGPT4, shouldITextYet }
