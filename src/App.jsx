import { Routes, Route, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ChatWindow from "./components/ChatWindow";
import SymptomChecker from "./components/SymptomChecker";
import Services from "./components/Services";
import Contact from "./components/Contact";

export default function App() {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="page-transition" key={location.pathname}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chat/:specialty" element={<ChatWindow />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}
