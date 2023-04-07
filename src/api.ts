import { Configuration, OpenAIApi } from 'openai'
import { PineconeClient } from 'pinecone-client'
import { Octokit } from '@octokit/rest'
import { config } from './config'

const openAiconfig = new Configuration({
    apiKey: config.openai_key
})

export const openai = new OpenAIApi(openAiconfig)

export const pinecone = new PineconeClient({
    namespace: config.pinecone_namespace,
    apiKey: config.pinecone_key,
    baseUrl: config.pinecone_base_url
})

export const octokit = new Octokit({ 
    auth: config.github_key
})