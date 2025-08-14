import octokit from "../services/octokitGithub.js";
import formatBytes from "../utils/formatBytes.js";
import getLanguageFromPath from "../utils/getLanguageFromPath.js";
import isTestable from "../utils/isTestable.js";
import parseRepoUrl from "../utils/parseRepoUrl.js";

const ALLOWED_EXT = [".js", ".ts", ".jsx", ".tsx", ".py"]; // keep scope tight

export const getRepoFiles = async (req, res) => {
  try {
    const { repoUrl } = req.query;
    const { owner, repo, branch } = parseRepoUrl(repoUrl);

    // 1. get repo metadata(including description)
    const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
    const repoMetaData = {
      name: repoData.name,
      owner: repoData.owner.login,
      description: repoData.description,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      language: repoData.language,
      lastUpdated: repoData.updated_at,
      branch: branch,
    };

    // 2. Get SHA of branch head
    const { data: ref } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });
    const { data: tree } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: ref.object.sha,
      recursive: "true",
    });

    // 3. Filter and map the file data into the desired rich format
    const files = tree.tree
      .filter(
        (n) =>
          n.type === "blob" && ALLOWED_EXT.some((ext) => n.path.endsWith(ext))
      )
      .map((file, index) => ({
        id: index + 1, // Generate a simple unique ID
        name: file.path.split("/").pop(), // Extract file name from path
        path: file.path,
        type: "file", // Map 'blob' to 'file'
        language: getLanguageFromPath(file.path),
        size: formatBytes(file.size), // Format the size
        testable: isTestable(file.path), // Check if it's a test file
        sha: file.sha, // Keep the sha for potential future use
      }));

    res.json({ owner, repo, branch, files, repoMetaData });
  } catch (err) {
    console.error("Error in getRepoFiles:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error, Please try again later!",
      details: err.message,
    });
  }
};

export const createPrWithTestCaseFile = async (req, res) => {
  try {
    const { repoUrl, testFile, generatedCode, summary } = req.body;
    console.log("PR Creation request body:", {
      repoUrl,
      testFile,
      hasGeneratedCode: !!generatedCode,
      summary: summary
        ? { file: summary.file, framework: summary.framework }
        : null,
    });

    if (!repoUrl || !testFile || !generatedCode || !summary) {
      return res.status(400).json({
        error: "repoUrl, testFile, generatedCode, and summary are required.",
      });
    }

    const { owner, repo, branch } = parseRepoUrl(repoUrl);
    console.log("Parsed repo details:", { owner, repo, branch });

    // Create a new branch name (sanitize it to avoid invalid characters)
    let branchName = `feature/add-${summary.file
      .toLowerCase()
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-z0-9-]/g, "-")}-tests`;

    console.log("Branch name to create:", branchName);

    try {
      // Get the latest commit SHA from the main branch
      console.log("Getting reference for branch:", branch);
      const { data: ref } = await octokit.rest.git.getRef({
        owner,
        repo,
        ref: `heads/${branch}`,
      });
      const baseSha = ref.object.sha;
      console.log("Base SHA:", baseSha);

      // Create a new branch
      console.log("Creating new branch:", branchName);
      try {
        await octokit.rest.git.createRef({
          owner,
          repo,
          ref: `refs/heads/${branchName}`,
          sha: baseSha,
        });
      } catch (branchError) {
        if (
          branchError.status === 422 &&
          branchError.response?.data?.message?.includes("already exists")
        ) {
          // Branch already exists, use a timestamp to make it unique
          const timestamp = Date.now();
          const uniqueBranchName = `${branchName}-${timestamp}`;
          console.log(
            "Branch exists, creating unique branch:",
            uniqueBranchName
          );
          await octokit.rest.git.createRef({
            owner,
            repo,
            ref: `refs/heads/${uniqueBranchName}`,
            sha: baseSha,
          });
          // Update branchName for later use
          branchName = uniqueBranchName;
        } else {
          throw branchError;
        }
      }

      // Create the test file content as base64
      const content = Buffer.from(generatedCode).toString("base64");

      // Create the file in the new branch
      console.log("Creating file at path:", testFile.path);
      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: testFile.path,
        message: `Add ${summary.framework} tests for ${summary.file}`,
        content,
        branch: branchName,
      });

      // Create the pull request
      console.log("Creating pull request...");
      const { data: pr } = await octokit.rest.pulls.create({
        owner,
        repo,
        title: `Add ${summary.framework} tests for ${summary.file}`,
        head: branchName,
        base: branch,
        body: `## Test Coverage for ${summary.file}

**Framework:** ${summary.framework}
**Complexity:** ${summary.complexity}
**Estimated Time:** ${summary.estimatedTime}
**Test Count:** ${summary.testCount}

### Coverage Areas:
${summary.coverage.map((area) => `- ${area}`).join("\n")}

### Description:
${summary.description}

---
*This PR was automatically generated by Testify AI*`,
      });

      console.log("PR created successfully:", pr.number);
      res.json({
        success: true,
        prUrl: pr.html_url,
        prNumber: pr.number,
        branchName,
        message: "Pull request created successfully!",
      });
    } catch (githubError) {
      console.error("GitHub API Error:", {
        message: githubError.message,
        status: githubError.status,
        response: githubError.response?.data,
      });

      // Handle specific GitHub errors
      if (githubError.status === 404) {
        return res.status(404).json({
          success: false,
          error: "Repository not found or insufficient permissions",
          details: `Cannot access repository ${owner}/${repo}. Please check if the repository exists and if you have the necessary permissions.`,
        });
      } else if (githubError.status === 401) {
        return res.status(401).json({
          success: false,
          error: "Authentication required",
          details:
            "GitHub authentication is required to create pull requests. Please configure your GitHub token.",
        });
      } else if (githubError.status === 403) {
        return res.status(403).json({
          success: false,
          error: "Insufficient permissions",
          details:
            "You don't have permission to create branches or pull requests in this repository.",
        });
      } else if (githubError.status === 422) {
        return res.status(422).json({
          success: false,
          error: "Validation failed",
          details:
            githubError.response?.data?.message || "GitHub validation error",
        });
      }

      throw githubError; // Re-throw for general error handler
    }
  } catch (error) {
    console.error("Error creating PR:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to create pull request",
      details: error.message,
    });
  }
};
