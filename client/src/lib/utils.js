import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function getLanguageIcon(language) {
  const icons = {
    javascript: "🟨",
    python: "🐍",
    java: "☕",
    typescript: "🔷",
    json: "📋",
    markdown: "📝",
    html: "🌐",
    css: "🎨",
    default: "📄",
  };
  return icons[language?.toLowerCase()] || icons.default;
}

export function generateTestFileName(originalFile, framework) {
  const nameWithoutExt = originalFile.replace(/\.[^/.]+$/, "");

  if (framework.includes("Jest")) {
    return `${nameWithoutExt}.test.js`;
  } else if (framework.includes("PyTest")) {
    return `test_${nameWithoutExt.toLowerCase()}.py`;
  } else if (framework.includes("JUnit")) {
    return `${nameWithoutExt}Test.java`;
  } else if (framework.includes("Selenium")) {
    return `test_${nameWithoutExt.toLowerCase()}_selenium.py`;
  }

  return `${nameWithoutExt}.test.js`;
}

export function estimateTestComplexity(file) {
  const complexityFactors = {
    size: file.size || 0,
    language: file.language || "javascript",
    path: file.path || "",
  };

  let score = 0;

  // Size factor
  if (complexityFactors.size > 5000) score += 2;
  else if (complexityFactors.size > 2000) score += 1;

  // Language factor
  if (["java", "python"].includes(complexityFactors.language)) score += 1;

  // Path complexity (deeper paths might be more complex)
  const pathDepth = complexityFactors.path.split("/").length;
  if (pathDepth > 3) score += 1;

  if (score >= 3) return "Hard";
  if (score >= 1) return "Medium";
  return "Easy";
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
