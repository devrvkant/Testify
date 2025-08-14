export default function parseRepoUrl(url) {
  // supports: https://github.com/{owner}/{repo}[.git][/tree/{branch}]
  const u = new URL(url);
  const [owner, repo, maybeTree, maybeBranch, ...rest] = u.pathname.replace(/^\/+/, '').split('/');
  return {
    owner,
    repo: (repo || '').replace(/\.git$/, ''),
    branch: (maybeTree === 'tree' && maybeBranch) ? maybeBranch : 'main',
  };
}
