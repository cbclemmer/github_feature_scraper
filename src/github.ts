import { octokit } from "./api"
import { config } from './config'
import { map } from 'lodash'

export type Issue = {
  id: number,
  title: string,
  text: string
}

export async function fetchGitHubIssues(page: number) {
  const issues = await octokit.rest.issues.listForRepo({ 
    owner: config.github_repo_owner,
    repo: config.github_repo,
    state: 'closed',
    per_page: 2,
    page
  })
  if (!issues) {
    throw "Error fetching issues"
  }

  return map(issues.data, (i) => ({
    id: i.id,
    title: i.title,
    text: i.body
  } as Issue))
}