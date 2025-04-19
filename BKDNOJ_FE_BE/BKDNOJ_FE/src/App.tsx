import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import ContestsPage from "./pages/ContestsPage";
import StandingPage from "./pages/StandingPage";
import StatusPage from "./pages/StatusPage";
import OrganizationPage from "./pages/OrganizationPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProblemsPage from "./pages/ProblemsPage";
import SubssmionPage from "./pages/SubmissionPage";
import SubmitForm from "./pages/SubmitForm";
import SomeProblemPage from "./pages/SomeProblemPage ";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/submissions" element={<SubssmionPage />} />
          <Route path="/submit" element={<SubmitForm />} />
          <Route path="/submitForm" element={<SomeProblemPage />} />
          <Route path="/contests" element={<ContestsPage />} />
          <Route path="/standing" element={<StandingPage />} />
          <Route path="/orgs" element={<OrganizationPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
