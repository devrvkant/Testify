import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Github,
  ArrowRight,
  TestTube,
  FileCode,
  Sparkles,
  CheckCircle,
  Zap,
  Target,
  Shield,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { setRepoUrl } from "../features/repo/repoSlice";

export const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const repoUrl = useSelector((state) => state.repo.repoUrl);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (repoUrl.trim()) {
      // Store repo URL in state and navigate to repository page
      navigate("/repository");
    }
  };

  const features = [
    {
      icon: TestTube,
      title: "Smart Test Generation",
      description:
        "AI-powered analysis of your code to generate comprehensive test cases",
    },
    {
      icon: Zap,
      title: "Multiple Frameworks",
      description:
        "Support for JUnit, Selenium, Jest, and more testing frameworks",
    },
    {
      icon: Target,
      title: "Targeted Testing",
      description:
        "Select specific files or groups of files for focused test generation",
    },
    {
      icon: Shield,
      title: "GitHub Integration",
      description:
        "Seamlessly create PRs with generated test cases directly to your repo",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Connect Repository",
      description: "Enter your GitHub repository URL to get started",
      icon: Github,
    },
    {
      step: "02",
      title: "Browse & Select",
      description: "View all code files and select which ones to test",
      icon: FileCode,
    },
    {
      step: "03",
      title: "Generate Tests",
      description:
        "AI analyzes your code and suggests comprehensive test cases",
      icon: Sparkles,
    },
    {
      step: "04",
      title: "Create PR",
      description:
        "Review and automatically create a pull request with test code",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="space-y-16 font-sans">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <Badge
            variant="secondary"
            className="text-sm font-medium px-4 py-2 font-sans"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            AI-Powered Testing
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-sans">
            Generate <span className="text-primary">Smart Tests</span>
            <br />
            for Your Code
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-sans">
            Automatically generate comprehensive test cases for your GitHub
            repositories using advanced AI. Support for multiple frameworks and
            seamless GitHub integration.
          </p>
        </div>

        {/* Repository URL Input */}
        <Card className="max-w-2xl mx-auto shadow-lg border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2 font-sans">
              <Github className="h-5 w-5" />
              <span>Enter Repository URL</span>
            </CardTitle>
            <CardDescription className="font-sans">
              Paste your GitHub repository URL to start generating tests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={repoUrl}
                  onChange={(e) => dispatch(setRepoUrl(e.target.value))}
                  className="flex-1 h-12 text-base font-sans"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-sans"
                  disabled={!repoUrl.trim()}
                >
                  <ArrowRight className="h-4 w-4 ml-2" />
                  Analyze
                </Button>
              </div>
              <p className="text-sm text-muted-foreground font-sans">
                Example: https://github.com/facebook/react
              </p>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold font-sans">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-sans">
            Everything you need to generate comprehensive, high-quality test
            cases
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border shadow-md hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold font-sans">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground font-sans">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How it Works */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold font-sans">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-sans">
            Simple 4-step process to generate and integrate tests into your
            workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <Card className="border shadow-md hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold font-sans">
                        {step.step}
                      </div>
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold font-sans">{step.title}</h3>
                      <p className="text-sm text-muted-foreground font-sans">
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-6 h-0.5 bg-primary"></div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-16">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold font-sans">
            Ready to Start Testing?
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto font-sans">
            Join thousands of developers who trust Testify for automated test
            generation
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => document.querySelector('input[type="url"]')?.focus()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 font-sans"
        >
          <Github className="h-5 w-5 mr-2" />
          Get Started Now
        </Button>
      </section>
    </div>
  );
};
