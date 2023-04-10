import { octokit } from "./api"
import { config } from './config'
import { map, find } from 'lodash'
import { readFileSync, existsSync, appendFileSync } from 'fs'

export type Issue = {
  id: number,
  title: string,
  text: string,
  date: string,
  comments: {
    author: string,
    text: string
  }[]
}

export function fetchLocalIssues(): Issue[] { 
  const issue_data: string = existsSync('data/issues.jsonl')
    ? readFileSync('data/issues.jsonl').toString()
    : ''

  const issue_data_list = issue_data.split('\n')
  const issues = []
  for (let i = 0; i < issue_data_list.length; i ++) {
    issues.push(JSON.parse(issue_data_list[i]) as Issue)
  }
  return issues
}

export function saveLocalIssue(issue: Issue) {
  appendFileSync('data/issues.jsonl', JSON.stringify(issue))
}

export async function fetchGitHubIssues(page: number): Promise<Issue[]> {
  const issues = await octokit.rest.issues.listForRepo({ 
    owner: config.github_repo_owner,
    repo: config.github_repo,
    state: 'closed',
    per_page: 10,
    page
  })
  if (!issues) {
    throw "Error fetching issues"
  }

  const ret_val: Issue[] = []
  for (let i = 0; i < issues.data.length; i++)
  {
    const item = issues.data[i]
    const data = {
      id: item.id,
      title: item.title,
      text: item.body || '',
      date: item.updated_at
    } as Issue

    const comments = (await octokit.rest.issues.listComments({
      owner: config.github_repo_owner,
      repo: config.github_repo,
      issue_number: item.id
    })).data

    data.comments = map(comments, (c) => ({
      author: c.user?.name || '',
      text: c.body || ''
    }))
  }

  return ret_val
}

export async function getIssuesToParse(): Promise<Issue[]> {
  const retIssues = []
  while (retIssues.length < 50) {
    const localIssues = fetchLocalIssues()
    const remoteIssues = await fetchGitHubIssues(1)
    const newIssues = []
    for (let i = 0; i < remoteIssues.length; i++) {
      const item = remoteIssues[i]
      const localIssue = find(localIssues, (issue) => issue.id == item.id)
      if (!localIssue) {
        saveLocalIssue(item)
      }
      retIssues.push(item)
    }
  }
  return retIssues
}