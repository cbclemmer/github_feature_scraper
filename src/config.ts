import * as fs from 'fs'

export type Config = {
    pinecone_namespace: string,
    pinecone_key: string,
    pinecone_base_url: string,
    openai_key: string,
    helpscout_key: string
    github_key: string,
    github_repo_owner: string
    github_repo: string
}

const configString = fs.readFileSync('./config.json').toString()
export const config: Config = JSON.parse(configString)