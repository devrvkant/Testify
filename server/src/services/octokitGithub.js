import { Octokit } from "@octokit/rest";
import { config } from "../config/env.js";

const octokit = new Octokit({
  auth: config.githubToken,
});

export default octokit;
