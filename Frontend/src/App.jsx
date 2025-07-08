import ClerkProviderWithRoutes from "./auth/ClerkProviderWithRoutes";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./layout/layout.jsx";
import { Home } from "./home/home.jsx";
import AskPage from "./askAI/askPage";
import QuestionAnswer from "./askAI/questionAnswer";
import SignInPage from "./auth/SignInPage";
import SignUpPage from "./auth/SignUpPage";

import './App.css';

function App() {
  return (
    <ClerkProviderWithRoutes>
      <Routes>
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/askAI" element={<AskPage />} />
          <Route path="/questionAnswer" element={<QuestionAnswer />} />
        </Route>
      </Routes>
    </ClerkProviderWithRoutes>
  );
}

export default App;
