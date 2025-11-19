import { useState } from 'react';
import LoginForm from './LoginForm.jsx';
import SignupForm from './SignupForm.jsx';

export default function AuthModal({ 
  mode = 'login', 
  onClose 
}) {
  const [currentMode, setCurrentMode] = useState(mode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* Dark blurred background */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 p-6">

        {currentMode === 'login' ? (
          <LoginForm 
            onClose={onClose} 
            switchToSignup={() => setCurrentMode('signup')} 
          />
        ) : (
          <SignupForm 
            onClose={onClose}
            switchToLogin={() => setCurrentMode('login')}
          />
        )}
      </div>
    </div>
  );
}
