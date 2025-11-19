import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home.jsx';
import AuthModal from './components/auth/authModel.jsx';
import Navbar from './components/layout/navbar.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Only Home route because that's all you provided */}
          <Route path="/" element={<HomeWithAuth />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

function HomeWithAuth() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  return (
    <div className="relative">
      <Navbar
        onAuthButtonClick={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
      />

      <Home />

      {authModalOpen && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
