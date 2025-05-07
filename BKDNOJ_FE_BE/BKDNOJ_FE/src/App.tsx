import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import ListContestsPage from "./pages/list_contest/ListContestsPage";
import StandingPage from "./pages/standings/StandingPage";
import StatusPage from "./pages/status/StatusPage";
import OrganizationPage from "./pages/organization/OrganizationPage";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";
import ListProblemsPage from "./pages/list_problem/ListProblemPage";
import SubssmionPage from "./pages/submission/SubmissionPage";
import SubmitForm from "./pages/SubmitForm";
import SomeProblemPage from "./pages/SomeProblemPage ";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import UserProfilePage from "./pages/profile/UserProfilePage ";
import DetailProblemPage from "./pages/problem/DetailProblemPage";
import DetailContestPage from "./pages/contest/DetailContestPage";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/listproblem" element={<ListProblemsPage />} />
          <Route path="/detailproblem" element={<DetailProblemPage />} />

          <Route path="/listcontest" element={<ListContestsPage />} />
          <Route path="/detailcontest" element={<DetailContestPage />} />

          <Route path="/submissions" element={<SubssmionPage />} />
          <Route path="/submit" element={<SubmitForm />} />
          <Route path="/submitForm" element={<SomeProblemPage />} />

          <Route path="/standing" element={<StandingPage />} />

          <Route path="/orgs" element={<OrganizationPage />} />

          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route path="/profile" element={<UserProfilePage />} />
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
