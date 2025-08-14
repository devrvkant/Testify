import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Github,
  ArrowRight,
  FileCode,
  Search,
  CheckCircle2,
  AlertCircle,
  Star,
  GitBranch,
  Calendar,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { useGetRepoQuery } from "../features/repo/repoApi";
import {
  setSelectedFiles,
  addSelectedFile,
  removeSelectedFile,
  clearSelectedFiles,
} from "../features/repo/repoSlice";

export const Repository = () => {
  const dispatch = useDispatch();
  const encodedRepoUrl = useSelector((state) => state.repo.encodedRepoUrl);
  const repoUrl = useSelector((state) => state.repo.repoUrl);
  const selectedFilesArray = useSelector((state) => state.repo.selectedFiles);
  const selectedFiles = new Set(selectedFilesArray.map((file) => file.id)); // Convert to Set of IDs for UI compatibility
  const {
    data: repoData,
    isLoading: isGettingRepo,
    isError,
    error,
  } = useGetRepoQuery(encodedRepoUrl, {
    skip: !encodedRepoUrl, // Skip the query if no URL is provided
  });

  if(repoData)  {
console.log("repo: ", repoData.repo)
    console.log("files: ", repoData.files)

  }

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const navigate = useNavigate();

  const handleFileToggle = (file) => {
    if (selectedFiles.has(file.id)) {
      dispatch(removeSelectedFile(file.id));
    } else {
      dispatch(addSelectedFile(file));
    }
  };

  const handleSelectAll = () => {
    const testableFiles = filteredFiles.filter((file) => file.testable);
    if (selectedFiles.size === testableFiles.length) {
      dispatch(clearSelectedFiles());
    } else {
      dispatch(setSelectedFiles(testableFiles));
    }
  };

  const handleGenerateTests = () => {
    if (selectedFiles.size > 0) {
      // Selected files are already in Redux state, no need for localStorage
      navigate("/test-cases");
    }
  };

  const getLanguageColor = (language) => {
    const colors = {
      javascript: "bg-yellow-100 text-yellow-800",
      python: "bg-blue-100 text-blue-800",
      java: "bg-orange-100 text-orange-800",
      json: "bg-gray-100 text-gray-800",
      markdown: "bg-purple-100 text-purple-800",
    };
    return colors[language] || "bg-gray-100 text-gray-800";
  };

  const filteredFiles = (repoData?.files || []).filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.path.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      (filterType === "testable" && file.testable) ||
      (filterType === "non-testable" && !file.testable) ||
      file.language === filterType;
    return matchesSearch && matchesFilter;
  });

  const testableFiles = filteredFiles.filter((file) => file.testable);

  if (!repoUrl) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="space-y-4">
            <AlertCircle className="h-20 w-20 text-muted-foreground mx-auto" />
            <div className="space-y-3">
              <h2 className="text-3xl font-bold font-sans">
                No Repository Selected
              </h2>
              <p className="text-lg text-muted-foreground font-sans">
                Please go back to home and enter a repository URL to get started
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            size="lg"
            className="font-sans"
          >
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Repository Header */}
      {repoData && (
        <Card className="border shadow-lg bg-card">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Github className="h-8 w-8 text-gray-700" />
                  <div>
                    <h1 className="text-2xl font-bold">
                      {repoData.repoMetaData?.owner}/
                      {repoData.repoMetaData?.name}
                    </h1>
                    <p className="text-muted-foreground">
                      {repoData.repoMetaData?.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>{repoData.repoMetaData?.stars} stars</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GitBranch className="h-4 w-4" />
                    <span>{repoData.repoMetaData?.forks} forks</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Updated {repoData.repoMetaData?.lastUpdated}</span>
                  </div>
                  <Badge variant="secondary">
                    {repoData.repoMetaData?.language}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Selected Files
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {selectedFiles.size}
                  </p>
                </div>
                <Button
                  onClick={handleGenerateTests}
                  disabled={selectedFiles.size === 0}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Generate Tests
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isGettingRepo && (
        <div className="space-y-6">
          <div className="flex items-center justify-center space-x-2 py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-lg font-medium">
              Loading repository files...
            </span>
          </div>
          <div className="grid gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* File Browser */}
      {!isGettingRepo && repoData?.files && repoData.files.length > 0 && (
        <div className="space-y-6">
          {/* Search and Filter Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search files and folders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex space-x-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">All Files</option>
                    <option value="testable">Testable Only</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    disabled={testableFiles.length === 0}
                  >
                    {selectedFiles.size === testableFiles.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Files List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Repository Files ({filteredFiles.length})
              </h2>
              <Badge variant="secondary" className="text-sm">
                {testableFiles.length} testable files
              </Badge>
            </div>

            <div className="grid gap-3">
              {filteredFiles.map((file) => (
                <Card
                  key={file.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedFiles.has(file.id)
                      ? "ring-2 ring-primary bg-accent"
                      : ""
                  } ${!file.testable ? "opacity-60" : ""}`}
                  onClick={() => file.testable && handleFileToggle(file)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {file.testable ? (
                          <Checkbox
                            checked={selectedFiles.has(file.id)}
                            onChange={() => handleFileToggle(file)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <FileCode className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <FileCode className="h-4 w-4 text-primary" />
                          <span className="font-medium truncate">
                            {file.name}
                          </span>
                          {selectedFiles.has(file.id) && (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {file.path}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Badge
                          variant="outline"
                          className={getLanguageColor(file.language)}
                        >
                          {file.language}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {file.size}
                        </span>
                        {!file.testable && (
                          <Badge variant="secondary" className="text-xs">
                            Not Testable
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredFiles.length === 0 && (
              <div className="text-center py-12">
                <FileCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No files found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search term or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
