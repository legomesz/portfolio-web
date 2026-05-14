export type GitHubRepo = {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  topics?: string[]
  stargazers_count: number
  forks_count: number
  updated_at: string
  pushed_at: string
  fork: boolean
}

type GitHubSearchResponse = {
  items: GitHubRepo[]
}

const MAX_REPOS = 3

const GITHUB_REPOS_URL =
  "https://api.github.com/search/repositories?q=user:legomesz+topic:portfolio+fork:false&sort=updated&order=desc&per_page=10"

export async function getGithubRepos(): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(GITHUB_REPOS_URL, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    })

    if (!response.ok) {
      console.warn("GitHub API indisponível:", response.status)
      return []
    }

    const data = (await response.json()) as GitHubSearchResponse

    return data.items
      .filter((repo) => !repo.fork)
      .sort(
        (a, b) =>
          new Date(b.updated_at || b.pushed_at).getTime() -
          new Date(a.updated_at || a.pushed_at).getTime()
      )
      .slice(0, MAX_REPOS)
  } catch (error) {
    console.warn("Erro ao buscar repositórios do GitHub:", error)
    return []
  }
}