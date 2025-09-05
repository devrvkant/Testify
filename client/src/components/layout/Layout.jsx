import { useLocation, Link, Outlet } from "react-router-dom";
import { Button } from "../ui/button";
import { TestTube, Github, Home, FileCode, Sparkles } from "lucide-react";

export const Layout = () => {
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Repository", href: "/repository", icon: Github },
    { name: "Test Cases", href: "/test-cases", icon: FileCode },
  ];

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
              <TestTube className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary font-sans">
                Testify
              </h1>
              <p className="text-xs text-muted-foreground font-sans">
                AI-Powered Test Generation
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`flex items-center space-x-2 font-sans ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex font-sans"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-screen-2xl mx-auto px-6 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 mt-auto">
        <div className="container max-w-screen-2xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <TestTube className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground font-sans">
                Testify - Automated Test Generation
              </span>
            </div>
            <div className="text-sm text-muted-foreground font-sans">
              Built with ❤️ using React, Vite & ShadCN
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
