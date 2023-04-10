import { openai } from './api'
import * as fs from 'fs'
import { Issue } from './github'

export type BotResponse = {
  issue: number,
  page: string,
  feature: string,
  description: string,
}

export async function extractFeatureInfo(issue: Issue): Promise<BotResponse> {
  const system_prompt = fs.readFileSync('prompts/extract_feature.prompt').toString()

  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
        {
            "role": "system",
            "content": system_prompt
        },
        {
            "role": "user",
            "content": issue.text
        }
    ]
  })

  const bot_response = res.data.choices[0].message?.content.trim()
  console.log(bot_response)
  if (!bot_response) {
    throw "Chat completion error"
  }
  const data = JSON.parse(bot_response)
  data.issue = issue.id
  return data as BotResponse
}