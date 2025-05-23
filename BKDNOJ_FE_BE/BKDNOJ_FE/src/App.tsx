import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import ListContestsPage from "./pages/list_contest/ListContestsPage";
import StandingPage from "./pages/standings/StandingPage";
import StatusPage from "./pages/status/StatusPage";
import OrganizationPage from "./pages/organization/OrganizationPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import ListProblemsPage from "./pages/list_problem/ListProblemPage";
import SubssmionPage from "./pages/submission/SubmissionPage";
import SubmitForm from "./pages/SubmitForm";
import SomeProblemPage from "./pages/SomeProblemPage ";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import UserProfilePage from "./pages/profile/UserProfilePage ";
import DetailProblemPage from "./pages/problem/DetailProblemPage";
import DetailContestPage from "./pages/contest/DetailContestPage";
import CreateContest from "./pages/create_contest/CreateContest";
import DetailContestWrapper from "./pages/contest/DetailContestWrapper";
import DetailProblemWrapper from "./pages/problem/DetailProblemWrapper";
import { AuthProvider } from "./pages/auth/contexts/AuthProvider";
import AdminContestPage from "./pages/manage/Contests/AdminContestPage";
import AdminProblemPage from "./pages/manage/Problems/AdminProblemPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* <Route path="/" element={<HomePage />} /> */}
            <Route path="/problems" element={<ListProblemsPage />} />

            <Route path="/problem/:problem_id" element={<DetailProblemPage />}>
              <Route index element={<DetailProblemWrapper />} />
              <Route path=":tab" element={<DetailProblemWrapper />} />
            </Route>

            <Route path="/contests" element={<ListContestsPage />} />

            <Route path="/contest/:contest_id" element={<DetailContestPage />}>
              <Route index element={<DetailContestWrapper />} />
              <Route path=":tab" element={<DetailContestWrapper />} />
            </Route>

            <Route
              path="/contest/:contest_id/problem/:problem_id"
              element={<DetailProblemPage />}
            />

            <Route path="/submissions" element={<SubssmionPage />} />

            <Route path="/submit" element={<SubmitForm />} />

            <Route path="/submitForm" element={<SomeProblemPage />} />

            <Route path="/standing" element={<StandingPage />} />

            <Route path="/orgs" element={<OrganizationPage />} />

            <Route path="/register" element={<RegisterPage />} />

            <Route path="/login" element={<LoginPage />} />

            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            <Route path="/profile/:user_name" element={<UserProfilePage />} />

            <Route path="/admin/contests" element={<AdminContestPage />} />

            <Route path="/admin/problems" element={<AdminProblemPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
