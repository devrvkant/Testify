const isTestable = (path) => {
  const lowerCasePath = path.toLowerCase();

  // 1. List of extensions for files we consider "source code" and thus testable.
  const sourceCodeExtensions = [
    '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.go', '.rb', '.php'
  ];

  // 2. List of patterns for files that are already tests and should be excluded.
  const testFilePatterns = ['.test.', '.spec.', '_test.'];

  // 3. Check if the file is an existing test file. If so, it's not "testable".
  for (const pattern of testFilePatterns) {
    if (lowerCasePath.includes(pattern)) {
      return false;
    }
  }

  // 4. Check if the file has a source code extension. If yes, it is "testable".
  for (const ext of sourceCodeExtensions) {
    if (lowerCasePath.endsWith(ext)) {
      return true;
    }
  }

  // 5. If it's not a test file and not a recognized source file, exclude it.
  return false;
};

export default isTestable;