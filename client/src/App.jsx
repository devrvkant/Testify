import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { Repository } from "./pages/Repository";
import { TestCases } from "./pages/TestCases";
import { GenerateTest } from "./pages/GenerateTest";
import { NotFound } from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Layout as wrapper
    children: [
      { index: true, element: <Home /> },
      { path: "repository", element: <Repository /> },
      { path: "test-cases", element: <TestCases /> },
      { path: "generate-test/:testId", element: <GenerateTest /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
