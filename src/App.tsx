import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // ✅ Add import!
import HomePage from "./HomePage";
import { AuthPage } from "./sign/components/AuthPage";
import AuthCallback from "./AuthCallback";
import News from "./News";
import Reports from "./Reports";
import UserProfile from "./UserProfile";
import IntroAnimation from "./IntroAnimation";

function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>

      {!introDone && <IntroAnimation onComplete={() => setIntroDone(true)} />}


      {introDone && (
        <Router>
          <Navbar />

          <div style={{ height: "64px", width: "100%" }} aria-hidden="true" />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/news" element={<News />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/community"
              element={
                <div className="mt-20 text-center text-xl font-semibold md-80">
                  Community Page (Coming Soon)
                </div>
              }
            />
          </Routes>

          <Footer /> 
        </Router>
      )}
    </>
  );
}

export default App;
