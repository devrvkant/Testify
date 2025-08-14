import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import {
  ArrowLeft,
  Copy,
  Download,
  Github,
  FileCode,
  TestTube,
  CheckCircle2,
  Sparkles,
  Clock,
  Target,
  ExternalLink,
  GitPullRequest,
} from "lucide-react";
import { selectSummaryById } from "../features/test/testSlice";
import { useGenerateTestCaseCodeMutation } from "../features/test/testApi";
import { useCreatePullRequestMutation } from "../features/repo/repoApi";

export const GenerateTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const repoUrl = useSelector((state) => state.repo.repoUrl);

  const selectedSummary = useSelector((state) =>
    selectSummaryById(state, testId)
  );
  const [
    generateTestCaseCode,
    { data: generatedCodeResponse, isLoading: isGeneratingCode },
  ] = useGenerateTestCaseCodeMutation();
  const [
    createPullRequest,
    { data: prResponse, isLoading: isCreatingPR, error: prError },
  ] = useCreatePullRequestMutation();

  const [prCreated, setPrCreated] = useState(false);
  const [prUrl, setPrUrl] = useState("");

  // Extract the actual code from the API response
  const generatedCode = generatedCodeResponse?.code || "";

  useEffect(() => {
    if (testId && selectedSummary) {
      // Auto-generate code when component loads
      handleGenerateCode();
    }
  }, [testId, selectedSummary]);

  // Handle PR response
  useEffect(() => {
    if (prResponse && prResponse.success) {
      setPrUrl(prResponse.prUrl);
      setPrCreated(true);
    }
  }, [prResponse]);

  const handleGenerateCode = async () => {
    if (!selectedSummary) return;

    try {
      await generateTestCaseCode(selectedSummary).unwrap();
    } catch (error) {
      console.error("Failed to generate test code:", error);
    }
  };

  const handleCopyCode = async () => {
    if (!generatedCode) return;

    try {
      await navigator.clipboard.writeText(generatedCode);
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  const handleDownloadCode = () => {
    if (!generatedCode || !selectedSummary) return;

    const element = document.createElement("a");
    const file = new Blob([generatedCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);

    let filename = "test.js";
    if (selectedSummary?.framework.includes("Pytest")) filename = "test.py";
    else if (selectedSummary?.framework.includes("JUnit"))
      filename = "Test.java";
    else if (selectedSummary?.framework.includes("Jest")) filename = "test.js";

    element.download = `${selectedSummary?.file?.replace(
      /\.[^/.]+$/,
      ""
    )}_${filename}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCreatePR = async () => {
    if (!generatedCode || !selectedSummary || !repoUrl) {
      console.error("Missing required data for PR creation");
      return;
    }

    try {
      // Determine test file path and extension based on framework
      let testFilePath = "";
      let fileExtension = "";

      if (selectedSummary.framework.includes("Pytest")) {
        fileExtension = ".py";
        testFilePath = `tests/test_${selectedSummary.file.replace(
          /\.[^/.]+$/,
          ""
        )}${fileExtension}`;
      } else if (selectedSummary.framework.includes("JUnit")) {
        fileExtension = ".java";
        testFilePath = `src/test/java/${selectedSummary.file.replace(
          /\.[^/.]+$/,
          ""
        )}Test${fileExtension}`;
      } else if (selectedSummary.framework.includes("Jest")) {
        fileExtension = ".js";
        testFilePath = `tests/${selectedSummary.file.replace(
          /\.[^/.]+$/,
          ""
        )}.test${fileExtension}`;
      } else {
        fileExtension = ".js";
        testFilePath = `tests/${selectedSummary.file.replace(
          /\.[^/.]+$/,
          ""
        )}.test${fileExtension}`;
      }

      const prData = {
        repoUrl,
        testFile: {
          path: testFilePath,
          name: `${selectedSummary.file.replace(
            /\.[^/.]+$/,
            ""
          )}.test${fileExtension}`,
        },
        generatedCode,
        summary: selectedSummary,
      };

      await createPullRequest(prData).unwrap();
    } catch (error) {
      console.error("Failed to create PR:", error);
    }
  };

  if (!selectedSummary) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-6 py-16">
          <TestTube className="h-20 w-20 text-muted-foreground mx-auto" />
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">No Test Summary Found</h2>
            <p className="text-muted-foreground">
              Please select a test case from the previous page
            </p>
          </div>
          <Button onClick={() => navigate("/test-cases")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Test Cases
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/test-cases")}
              className="p-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold font-sans">
              Generated Test Code
            </h1>
          </div>
          <p className="text-muted-foreground font-sans">
            AI-generated test code for <strong>{selectedSummary.file}</strong>
          </p>
        </div>
      </div>

      {/* Test Summary Card */}
      <Card className="border-0 shadow-md bg-card">
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-3 lg:space-y-0">
            <div className="space-y-2">
              <CardTitle className="flex items-center space-x-2">
                <TestTube className="h-5 w-5" />
                <span>{selectedSummary.title}</span>
              </CardTitle>
              <CardDescription className="text-base">
                {selectedSummary.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <FileCode className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {selectedSummary.file}
              </span>
            </div>
            <Badge variant="outline">{selectedSummary.framework}</Badge>
            <Badge
              variant="secondary"
              className="text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30"
            >
              {selectedSummary.complexity}
            </Badge>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{selectedSummary.estimatedTime}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>{selectedSummary.testCount} tests</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Generation */}
      {isGeneratingCode ? (
        <Card className="border-0 shadow-lg bg-accent">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Generating Test Code</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  AI is writing comprehensive test code based on your selected
                  summary. This includes setup, test methods, and assertions...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : generatedCode ? (
        <div className="space-y-6">
          {/* Code Actions */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-medium">
                    Test code generated successfully
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleCopyCode}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                  <Button variant="outline" onClick={handleDownloadCode}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generated Code */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileCode className="h-5 w-5" />
                <span>Generated Test Code</span>
              </CardTitle>
              <CardDescription>
                Review the generated test code below. You can copy, download, or
                create a PR.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Textarea
                  value={generatedCode}
                  readOnly
                  className="min-h-[500px] font-mono text-sm bg-muted border"
                />
              </div>
            </CardContent>
          </Card>

          {/* Create PR Section */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Github className="h-5 w-5" />
                <span>Create Pull Request</span>
              </CardTitle>
              <CardDescription>
                Create a pull request with the generated test code directly to
                your repository
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {prError && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
                  <div className="space-y-1">
                    <h4 className="font-medium">Failed to create PR</h4>
                    <p className="text-sm">
                      {prError?.data?.error ||
                        "An error occurred while creating the pull request"}
                    </p>
                  </div>
                </div>
              )}

              {!prCreated ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg border">
                    <div className="space-y-2">
                      <h4 className="font-medium">PR Details:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>
                          • Branch: feature/add-
                          {selectedSummary.file
                            .toLowerCase()
                            .replace(/\.[^/.]+$/, "")}
                          -tests
                        </li>
                        <li>
                          • Title: Add {selectedSummary.framework} tests for{" "}
                          {selectedSummary.file}
                        </li>
                        <li>• Files: 1 test file will be created</li>
                        <li>• Framework: {selectedSummary.framework}</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleCreatePR}
                      disabled={isCreatingPR}
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isCreatingPR ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                          Creating PR...
                        </>
                      ) : (
                        <>
                          <GitPullRequest className="h-4 w-4 mr-2" />
                          Create Pull Request
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4 p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                      Pull Request Created Successfully!
                    </h3>
                    <p className="text-green-700 dark:text-green-300">
                      Your test code has been committed and a pull request has
                      been created.
                    </p>
                    {prResponse && (
                      <div className="text-sm text-green-600 dark:text-green-400 space-y-1">
                        <p>PR #{prResponse.prNumber}</p>
                        <p>Branch: {prResponse.branchName}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => window.open(prUrl, "_blank")}
                      className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-950/20"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Pull Request
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPrCreated(false);
                        setPrUrl("");
                      }}
                      className="border-primary text-primary hover:bg-accent"
                    >
                      Create Another PR
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border-0 shadow-md">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-3">
                <Button
                  onClick={handleGenerateCode}
                  disabled={isGeneratingCode}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Test Code
                </Button>
              </div>
              <p className="text-muted-foreground">
                Click the button above to generate test code for this summary
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
