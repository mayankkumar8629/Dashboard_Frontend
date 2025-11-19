import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginForm({ onClose, switchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';
    if (!password.trim()) newErrors.password = 'Password is required';
    if (!accountType) newErrors.accountType = 'Please select an account type';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      await login(email, password, accountType);
      toast.success('Login successful!', { position: 'top-left', autoClose: 2500 });
      onClose?.();
    } catch (error) {
      let errorMessage = 'Login failed';
      if (error.response?.data?.error) errorMessage = error.response.data.error;
      else if (error.request) errorMessage = 'Network error';
      else if (error.message) errorMessage = error.message;
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Replace with your actual Google OAuth URL
    window.location.href = "/auth/google";
  };

  return (
    <>
      {/* BLUR BACKDROP */}
      <div
        className="fixed inset-0 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* LOGIN MODAL */}
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="w-full max-w-md bg-gray-900 p-10 rounded-2xl border border-gray-700 shadow-2xl bg-opacity-95">

          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="text-gray-400 mt-1">Log in to your account</p>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl transition transform hover:scale-110"
            >
              &times;
            </button>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-sm">
              {apiError}
            </div>
          )}

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 mb-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google Logo"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="mx-3 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm text-gray-400">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm text-gray-400">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 bg-gray-800 border ${errors.password ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>

            {/* Account Type */}
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Account Type</label>
              <div className="flex items-center space-x-5 mt-2">
                <label className="flex items-center cursor-pointer text-gray-300">
                  <input
                    type="radio"
                    name="accountType"
                    value="influencer"
                    checked={accountType === 'influencer'}
                    onChange={() => setAccountType('influencer')}
                    className="w-4 h-4 mr-2 accent-blue-500"
                  />
                  Influencer
                </label>

                <label className="flex items-center cursor-pointer text-gray-300">
                  <input
                    type="radio"
                    name="accountType"
                    value="brand"
                    checked={accountType === 'brand'}
                    onChange={() => setAccountType('brand')}
                    className="w-4 h-4 mr-2 accent-purple-500"
                  />
                  Brand
                </label>
              </div>
              {errors.accountType && <p className="text-red-500 text-xs mt-1">{errors.accountType}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-6 py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg mt-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-600 hover:to-purple-700'}`}
            >
              {isLoading ? 'Logging in...' : 'Continue'}
            </button>
          </form>

          {/* Switch to Signup */}
          <div className="text-center mt-6 text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={switchToSignup}
              className="text-blue-400 hover:underline"
            >
              Sign up
            </button>
          </div>

          <ToastContainer theme="dark" />
        </div>
      </div>
    </>
  );
}
