import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Skeleton } from "../components/ui/skeleton";
import {
  ArrowRight,
  ArrowLeft,
  FileCode,
  TestTube,
  Sparkles,
  CheckCircle2,
  Clock,
  Target,
  AlertTriangle,
  Lightbulb,
  Zap,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useGenerateTestSummariesMutation } from "../features/test/testApi";
import {
  selectAllSummaries,
  selectIsGenerating,
} from "../features/test/testSlice";

export const TestCases = () => {
  const [generateTestSummaries] = useGenerateTestSummariesMutation();

  // Get data from Redux state instead of API response
  const testSummaries = useSelector(selectAllSummaries);
  const isGeneratingSummaries = useSelector(selectIsGenerating);

  const selectedFiles = useSelector((state) => state.repo.selectedFiles);
  const repoUrl = useSelector((state) => state.repo.repoUrl);
  const navigate = useNavigate();

  // Debug logging
  console.log("TestCases - testSummaries:", testSummaries);
  console.log("TestCases - isGeneratingSummaries:", isGeneratingSummaries);

  useEffect(() => {
    if (selectedFiles && selectedFiles.length > 0) {
      const generateTestSummariesForSelectedFiles = {
        repoUrl: repoUrl,
        selected: selectedFiles.map((file) => ({
          path: file.path,
          sha: file.sha,
        })),
      };
      generateTestSummaries(generateTestSummariesForSelectedFiles);
    }
  }, [navigate, selectedFiles]);

  const getComplexityColor = (complexity) => {
    const colors = {
      Easy: "bg-green-500/10 text-green-700 border-green-500/20",
      Medium: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
      Hard: "bg-red-500/10 text-red-700 border-red-500/20",
    };
    return colors[complexity] || "bg-muted text-muted-foreground";
  };

  const getFrameworkIcon = (framework) => {
    if (framework.includes("Jest")) return <Zap className="h-4 w-4" />;
    if (framework.includes("PyTest")) return <TestTube className="h-4 w-4" />;
    if (framework.includes("JUnit")) return <Target className="h-4 w-4" />;
    if (framework.includes("Selenium"))
      return <Lightbulb className="h-4 w-4" />;
    return <TestTube className="h-4 w-4" />;
  };

  const handleGenerateCode = (testSummary) => {
    navigate(`/generate-test/${testSummary.id}`);
  };

  if (selectedFiles.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="space-y-4">
            <AlertTriangle className="h-20 w-20 text-muted-foreground mx-auto" />
            <div className="space-y-3">
              <h2 className="text-3xl font-bold font-sans">
                No Files Selected
              </h2>
              <p className="text-lg text-muted-foreground font-sans">
                Please select files from the repository to generate tests
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/repository")}
            variant="outline"
            size="lg"
            className="font-sans"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Repository
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
              onClick={() => navigate("/repository")}
              className="p-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold font-sans">
              Test Case Generation
            </h1>
          </div>
          <p className="text-muted-foreground">
            AI-generated test case summaries for {selectedFiles.length} selected
            files
          </p>
        </div>

        {!isGeneratingSummaries && testSummaries.length > 0 && (
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Total Test Summaries
              </p>
              <p className="text-2xl font-bold text-primary">
                {testSummaries.length}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Selected Files Summary */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileCode className="h-5 w-5" />
            <span>Selected Files</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                <FileCode className="h-3 w-3 mr-1" />
                {file.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generation Progress */}
      {isGeneratingSummaries && (
        <Card className="border-0 shadow-lg bg-accent">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Generating Test Cases</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Our AI is analyzing your code and generating comprehensive
                  test case summaries. This may take a few moments...
                </p>
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Summaries */}
      {!isGeneratingSummaries && testSummaries.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Generated Test Summaries</h2>
            <Badge variant="secondary" className="text-sm">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Generation Complete
            </Badge>
          </div>

          <div className="grid gap-6">
            {testSummaries.map((summary) => (
              <Card
                key={summary.id}
                className="border-0 shadow-md hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-3 lg:space-y-0">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {getFrameworkIcon(summary.framework)}
                        <CardTitle className="text-lg">
                          {summary.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-base">
                        {summary.description}
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => handleGenerateCode(summary)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Generate Code
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <FileCode className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {summary.file}
                      </span>
                    </div>
                    <Badge variant="outline">{summary.framework}</Badge>
                    <Badge className={getComplexityColor(summary.complexity)}>
                      {summary.complexity}
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{summary.estimatedTime}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <TestTube className="h-4 w-4" />
                      <span>{summary.testCount} tests</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Test Coverage Areas:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {summary.coverage.map((area, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isGeneratingSummaries && testSummaries.length === 0 && (
        <div className="text-center space-y-6 py-16">
          <TestTube className="h-16 w-16 text-muted-foreground mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-medium">No Test Cases Generated</h3>
            <p className="text-muted-foreground">
              There was an issue generating test cases. Please try again.
            </p>
          </div>
          <Button
            onClick={() => {
              const generateTestSummariesForSelectedFiles = {
                repoUrl: repoUrl,
                selected: selectedFiles.map((file) => ({
                  path: file.path,
                  sha: file.sha,
                })),
              };
              generateTestSummaries(generateTestSummariesForSelectedFiles);
            }}
            variant="outline"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Regenerate Tests
          </Button>
        </div>
      )}
    </div>
  );
};
