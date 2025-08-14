import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Repository } from "./pages/Repository";
import { TestCases } from "./pages/TestCases";
import { GenerateTest } from "./pages/GenerateTest";
import { NotFound } from "./pages/NotFound";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/repository" element={<Repository />} />
          <Route path="/test-cases" element={<TestCases />} />
          <Route path="/generate-test/:testId" element={<GenerateTest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
