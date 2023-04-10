import { openai } from './api'
import * as fs from 'fs'

export type BotResponse = {
  page: string,
  feature: string,
  description: string
}

export async function extractFeatureInfo(issueText: string, issueNum: number): Promise<string> {
  console.log(issueText)
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
            "content": issueText
        }
    ]
  })

  const bot_response = res.data.choices[0].message?.content.trim()
  console.log(bot_response)
  if (!bot_response) {
    throw "Chat completion error"
  }
  const data = JSON.parse(bot_response)
  data.issue = issueNum
  return data
}