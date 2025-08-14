import ai from "../services/gemini.js";
import parseRepoUrl from "../utils/parseRepoUrl.js";
import octokit from "../services/octokitGithub.js";

const MAX_FILE_BYTES = 20000;

export const generateSummaries = async (req, res) => {
  try {
    const { repoUrl, selected } = req.body;

    if (!selected || selected.length === 0) {
      return res.status(400).json({ error: "No files were selected." });
    }

    const { owner, repo } = parseRepoUrl(repoUrl);

    const filesWithContent = await fetchFiles(octokit, owner, repo, selected);
    console.log("Files with content:", filesWithContent);

    // Use Promise.all to run requests in parallel for better performance
    const summaries = await Promise.all(
      filesWithContent.map((file, index) => generateSingleSummary(file, index))
    );

    // Filter out any null results from failed AI calls and add file content
    const summariesWithContent = summaries
      .filter((s) => s !== null)
      .map((summary, index) => ({
        ...summary,
        content: filesWithContent[index]?.content || "",
      }));

    res.json({ summaries: summariesWithContent });
  } catch (e) {
    console.error("Error in generateSummaries:", e.message);
    res.status(500).json({
      error: "Failed to generate test summaries.",
      details: e.message,
    });
  }
};

export const generateTestCaseCode = async (req, res) => {
  try {
    const summary = req.body; // Accept the entire selectedSummary object

    if (!summary || !summary.content || !summary.title) {
      return res
        .status(400)
        .json({ error: "Summary with content is required." });
    }

    // 1. Craft a detailed prompt for code generation
    const prompt = `
      You are an expert senior test engineer. Your task is to write a complete, runnable, and high-quality test file.

      Based on the provided source code and the test summary, write the actual test code using the specified framework.

      **Instructions:**
      1.  Choose the best Testing library/framework according to source content I am giving(based on it you decide the file type and framework)
      1.  Implement all the test cases described in the summary's "coverage" section.
      2.  Follow best practices for the testing framework.
      3.  The code should be complete and ready to run. Include all necessary imports.
      4.  Do NOT include any explanations, comments, or markdown formatting like \`\`\`javascript.
      5.  Your entire output should be ONLY the raw code for the test file.

      ---
      **Test Summary to Implement:**
      - Title: ${summary.title}
      - Description: ${summary.description}
      - Coverage Areas: ${summary.coverage.join(", ")}

      **Source Code to Test:**
      \`\`\`
      ${summary.content}
      \`\`\`
      ---
    `;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const code = result.text;

    res.json({ code });
  } catch (e) {
    console.error("Error in generateCode:", e.message);
    res
      .status(500)
      .json({ error: "Failed to generate test code.", details: e.message });
  }
};

async function generateSingleSummary(file, index) {
  const fileExtension = file.path.split(".").pop().toLowerCase();
  let framework = "Jest";

  if (["js", "jsx", "ts", "tsx"].includes(fileExtension)) {
    framework = "Jest + React Testing Library";
  } else if (fileExtension === "py") {
    framework = "Pytest";
  }

  // Generate a unique ID using timestamp and index
  const uniqueId = `test_${Date.now()}_${index}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  const prompt = `
    You are an expert senior test engineer. Your task is to analyze the provided source code file and propose a single, concise, high-quality test case summary.

    You MUST output a single JSON object with the exact following structure. Do not include any other text, comments, or markdown formatting like \`\`\`json.

    {
      "id": "string",
      "file": "string",
      "framework": "string",
      "title": "string",
      "description": "string",
      "complexity": "string",
      "estimatedTime": "string",
      "testCount": "number",
      "coverage": ["string"]
    }

    Field instructions:
    - id: Use this exact ID: "${uniqueId}".
    - file: The name of the file being tested.
    - framework: The testing framework to be used.
    - title: A short, descriptive title for the test suite (e.g., "API Endpoint Validation", "Component Rendering & Hooks").
    - description: A one-sentence summary of what this test suite covers.
    - complexity: Estimate the complexity to write these tests. Must be one of: 'Low', 'Medium', 'High'.
    - estimatedTime: A string estimating the time to write these tests (e.g., "5 mins", "15 mins", "30 mins").
    - testCount: An estimated number of individual test assertions (it blocks) this suite would contain.
    - coverage: An array of 2-5 strings listing key areas or functions that will be tested (e.g., "Props validation", "Error handling", "State updates").

    ---
    ANALYZE THIS FILE:
    File Name: ${file.path}
    Framework: ${framework}
    File Content:
    ${file.content}
    ---
  `;

  try {
    // THIS IS THE CORRECTED SYNTAX
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.text;
    const jsonString = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error(`Failed to generate summary for ${file.path}:`, error);
    return null; // Return null if this specific call fails
  }
}

async function fetchFiles(octokit, owner, repo, items) {
  const out = [];
  for (const it of items) {
    const { data } = await octokit.rest.git.getBlob({
      owner,
      repo,
      file_sha: it.sha,
    });
    const buf = Buffer.from(data.content, "base64");
    out.push({
      path: it.path,
      content: buf.slice(0, MAX_FILE_BYTES).toString("utf8"),
    });
  }
  console.log("fetched files:", out);
  return out;
}
