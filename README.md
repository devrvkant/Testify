# 🧪 Testify - AI-Powered Test Case Generator

<div align="center">

![Testify Logo](https://img.shields.io/badge/Testify-AI%20Testing-blue?style=for-the-badge&logo=testcafe&logoColor=white)

**Generate comprehensive, intelligent test cases for your codebase with AI**

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=flat&logo=google&logoColor=white)](https://gemini.google.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Integration-181717?style=flat&logo=github&logoColor=white)](https://github.com/)

[🚀 Live Demo](#demo) • [📖 Documentation](#documentation) • [🛠️ Installation](#installation) • [🤝 Contributing](#contributing)

</div>

---

## 🌟 Overview

**Testify** is an intelligent, AI-powered platform that automatically analyzes your codebase and generates comprehensive test cases. By leveraging Google's Gemini AI, Testify understands your code context and creates meaningful, executable test suites that follow industry best practices.

### ✨ Key Features

- 🤖 **AI-Powered Analysis** - Advanced code understanding using Google Gemini
- 🎯 **Multi-Framework Support** - Jest, Pytest, JUnit, React Testing Library
- 📁 **GitHub Integration** - Direct repository analysis and PR creation
- 🎨 **Modern UI/UX** - Beautiful, responsive interface with dark mode
- ⚡ **Real-time Generation** - Fast, parallel test case creation
- 🔄 **Automated Workflow** - From analysis to PR creation

---

## 🏗️ Architecture

### Tech Stack

#### Frontend

- **React 19.1.1** - Modern React with latest features
- **Vite** - Lightning-fast build tool
- **TailwindCSS 4** - Utility-first CSS framework
- **Redux Toolkit** - State management with RTK Query
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

#### Backend

- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Fast, minimalist web framework
- **Google Gemini AI** - Advanced language model
- **Octokit** - GitHub API integration
- **CORS** - Cross-origin resource sharing

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- GitHub Personal Access Token
- Google Gemini API Key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/devrvkant/Testify.git
   cd Testify
   ```

2. **Install dependencies**

   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the `server` directory:

   ```env
   PORT=5500
   NODE_ENV=development
   GITHUB_TOKEN=your_github_personal_access_token
   CLIENT_URL=http://localhost:5173
   TESTIFY_API_KEY=your_google_gemini_api_key
   ```

   Create a `.env` file in the `client` directory:

   ```env
   VITE_SERVER_URL=http://localhost:5500
   ```

4. **Start the development servers**

   ```bash
   # Terminal 1 - Start server
   cd server
   npm run dev

   # Terminal 2 - Start client
   cd client
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

---

## 🎯 How It Works

### 1. **Repository Connection**

- Enter your GitHub repository URL
- Testify fetches and analyzes your codebase structure
- Filters testable files (.js, .jsx, .ts, .tsx, .py)

### 2. **File Selection**

- Browse through your repository files
- Select specific files for test generation
- View file metadata (size, language, complexity)

### 3. **AI Analysis & Test Generation**

- AI analyzes each selected file's content and context
- Generates intelligent test summaries with:
  - Framework recommendations
  - Complexity estimation
  - Time estimates
  - Test coverage areas

### 4. **Code Generation**

- Creates executable test code based on summaries
- Follows framework-specific best practices
- Includes proper imports and setup

### 5. **GitHub Integration**

- Creates new feature branches
- Commits generated test files
- Opens pull requests with detailed descriptions

---

## 📋 Features Deep Dive

### 🤖 Smart Test Analysis

```javascript
// Example generated test summary
{
  "id": "test_1723123456789_0_abc123def",
  "file": "userService.js",
  "framework": "Jest + React Testing Library",
  "title": "User Service API Testing",
  "description": "Comprehensive tests for user authentication and data management",
  "complexity": "Medium",
  "estimatedTime": "15 mins",
  "testCount": 8,
  "coverage": [
    "Authentication flows",
    "Error handling",
    "Data validation",
    "API integration"
  ]
}
```

### 🎨 Framework Support

| Framework                        | File Types                   | Features                            |
| -------------------------------- | ---------------------------- | ----------------------------------- |
| **Jest + React Testing Library** | `.js`, `.jsx`, `.ts`, `.tsx` | Component testing, hooks, events    |
| **Pytest**                       | `.py`                        | Unit tests, fixtures, mocking       |
| **JUnit**                        | `.java`                      | Unit tests, assertions, test suites |

### 🔄 GitHub Workflow

1. **Branch Creation**: `feature/add-{filename}-tests`
2. **File Structure**: Framework-appropriate test directories
3. **PR Details**: Comprehensive descriptions with coverage info
4. **Automated Commits**: Meaningful commit messages

---

## 🛠️ API Reference

### Test Generation Endpoints

#### Generate Test Summaries

```http
POST /api/testcase/summaries
Content-Type: application/json

{
  "repoUrl": "https://github.com/owner/repo",
  "selected": [
    {
      "path": "src/utils/helper.js",
      "sha": "abc123..."
    }
  ]
}
```

#### Generate Test Code

```http
POST /api/testcase/generate
Content-Type: application/json

{
  "id": "test_1723123456789_0_abc123def",
  "file": "helper.js",
  "framework": "Jest",
  "content": "// file content...",
  "coverage": ["utility functions", "error handling"]
}
```

### GitHub Integration Endpoints

#### Create Pull Request

```http
POST /api/github/create-pr
Content-Type: application/json

{
  "repoUrl": "https://github.com/owner/repo",
  "testFile": {
    "path": "tests/helper.test.js",
    "name": "helper.test.js"
  },
  "generatedCode": "// test code...",
  "summary": { /* test summary object */ }
}
```

---

## 🎨 UI Components

### Design System

- **Color Scheme**: Customizable themes with dark mode support
- **Typography**: System fonts with careful hierarchy
- **Spacing**: Consistent 4px grid system
- **Components**: Accessible, reusable UI primitives

### Key Pages

1. **Home** - Landing page with repository input
2. **Repository** - File browser and selection interface
3. **Test Cases** - Generated test summaries with actions
4. **Generate Test** - Code generation and PR creation

---

## 📊 State Management

### Redux Store Structure

```javascript
{
  repo: {
    repoUrl: string,
    encodedRepoUrl: string,
    selectedFiles: Array<File>
  },
  test: {
    summaries: Array<TestSummary>,
    isGenerating: boolean,
    error: string | null
  }
}
```

### RTK Query APIs

- **repoApi** - Repository and GitHub operations
- **testApi** - Test generation and management

---

## 🧪 Testing Strategy

### Generated Test Patterns

#### React Components

```javascript
import { render, screen, fireEvent } from "@testing-library/react";
import { UserProfile } from "./UserProfile";

describe("UserProfile Component", () => {
  test("renders user information correctly", () => {
    const mockUser = { name: "John Doe", email: "john@example.com" };
    render(<UserProfile user={mockUser} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });
});
```

#### Python Functions

```python
import pytest
from src.utils.calculator import add, divide

class TestCalculator:
    def test_add_positive_numbers(self):
        assert add(2, 3) == 5

    def test_divide_by_zero_raises_exception(self):
        with pytest.raises(ZeroDivisionError):
            divide(10, 0)
```

---

## 🚀 Deployment

### Client (Frontend)

```bash
cd client
npm run build
# Deploy dist/ folder to your hosting platform
```

### Server (Backend)

```bash
cd server
npm start
# Deploy to your server platform (Heroku, AWS, etc.)
```

### Environment Variables

Ensure all production environment variables are properly configured:

- GitHub token with repository access
- Google Gemini API key
- Correct CORS origins

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- **Frontend**: ESLint + Prettier
- **Backend**: Node.js best practices
- **Commits**: Conventional commit format

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Ravikant Jangir** - _Lead Developer_ - [@devrvkant](https://github.com/devrvkant)

---

## 🙏 Acknowledgments

- [Google Gemini](https://gemini.google.com/) for AI capabilities
- [GitHub API](https://docs.github.com/en/rest) for repository integration
- [React Testing Library](https://testing-library.com/) for testing patterns
- [Tailwind CSS](https://tailwindcss.com/) for design system

---

## 📞 Support

Having trouble? Check out our:

- [Documentation](docs/)
- [Issue Tracker](https://github.com/devrvkant/Testify/issues)
- [Discussions](https://github.com/devrvkant/Testify/discussions)

---

<div align="center">

**Made with ❤️ for developers who love testing**

[⭐ Star this repo](https://github.com/devrvkant/Testify) if you find it helpful!

</div>
