export default function makeOctokit(tokenOverride) {
  return new Octokit({ auth: tokenOverride });
}