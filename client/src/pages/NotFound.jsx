import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center font-sans">
      <Card className="max-w-md w-full border shadow-lg">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto" />
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground font-sans">
                404
              </h1>
              <h2 className="text-xl font-semibold text-foreground font-sans">
                Page Not Found
              </h2>
              <p className="text-muted-foreground font-sans">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center space-x-2 font-sans"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </Button>
            <Button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground font-sans"
            >
              <Home className="h-4 w-4" />
              <span>Go Home</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
