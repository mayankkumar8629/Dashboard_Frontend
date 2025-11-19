import { useState } from 'react';
import { signupUser } from '../../services/authService.js';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignupForm({ onClose, switchToLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError(null);
    if (name === 'password') validatePasswordRequirements(value);
  };

  const validatePasswordRequirements = (password) => {
    setPasswordRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    else if (formData.username.trim().length < 3) newErrors.username = "Username must be at least 3 characters long";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email address";

    if (!formData.accountType) newErrors.accountType = "Please select an account type";

    const pr = passwordRequirements;
    if (!formData.password) newErrors.password = "Password is required";
    else if (!pr.length || !pr.uppercase || !pr.lowercase || !pr.number || !pr.special) newErrors.password = "Password does not meet all requirements";

    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      await signupUser(userData);
      toast.success("Account created successfully!", { position: "top-right", autoClose: 3000 });
      setFormData({ username: '', email: '', password: '', confirmPassword: '', accountType: '' });
      setTimeout(() => switchToLogin(), 2000);
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";
      if (error.response?.data?.message) errorMessage = error.response.data.message;
      else if (error.response?.data?.error) errorMessage = error.response.data.error;
      toast.error(errorMessage);
      if (error.response?.data?.errors) setErrors(error.response.data.errors);
      else setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getRequirementColor = (met) => (met ? 'text-green-400' : 'text-red-400');
  const getRequirementIcon = (met) => (met ? '✓' : '✗');

  const handleGoogleSignup = () => {
    window.location.href = "/auth/google";
  };

  return (
    <>
      {/* BLUR BACKDROP */}
      <div
        className="fixed inset-0 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* SIGNUP MODAL */}
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4 py-8">
        <div
          className="w-full max-w-6xl bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl bg-opacity-95 max-h-[95vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col lg:flex-row h-full">
            
            {/* LEFT SIDE - FORM FIELDS */}
            <div className="flex-1 p-8 lg:p-10 overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Create Account
                  </h2>
                  <p className="text-gray-400 mt-1">Join us today</p>
                </div>

                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white text-2xl transition transform hover:scale-110"
                >
                  &times;
                </button>
              </div>

              {/* API ERROR */}
              {apiError && (
                <div className="mb-6 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-sm">
                  ⚠ {apiError}
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm text-gray-400">Username</label>
                    <input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      className={`w-full px-4 py-3 bg-gray-800 border ${errors.username ? "border-red-500" : "border-gray-700"} rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    />
                    {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm text-gray-400">Email</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={`w-full px-4 py-3 bg-gray-800 border ${errors.email ? "border-red-500" : "border-gray-700"} rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  </div>
                </div>

                {/* Account Type */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Account Type</label>
                  <div className="flex items-center gap-6 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="accountType" 
                        value="INFLUENCER" 
                        checked={formData.accountType === "INFLUENCER"} 
                        onChange={handleChange}
                        className="w-4 h-4 accent-blue-500"
                      />
                      <span className="text-gray-300">Influencer</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="accountType" 
                        value="BRAND" 
                        checked={formData.accountType === "BRAND"} 
                        onChange={handleChange}
                        className="w-4 h-4 accent-purple-500"
                      />
                      <span className="text-gray-300">Brand</span>
                    </label>
                  </div>
                  {errors.accountType && <p className="text-red-500 text-xs">{errors.accountType}</p>}
                </div>

                {/* Password and Confirm Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm text-gray-400">Password</label>
                    <input 
                      id="password"
                      type="password" 
                      name="password" 
                      onChange={handleChange} 
                      value={formData.password} 
                      placeholder="Create your password" 
                      className={`w-full px-4 py-3 bg-gray-800 border ${errors.password ? "border-red-500" : "border-gray-700"} rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    />
                    {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm text-gray-400">Confirm Password</label>
                    <input 
                      id="confirmPassword"
                      type="password" 
                      name="confirmPassword" 
                      onChange={handleChange} 
                      value={formData.confirmPassword} 
                      placeholder="Confirm your password" 
                      className={`w-full px-4 py-3 bg-gray-800 border ${errors.confirmPassword ? "border-red-500" : "border-gray-700"} rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                    {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
                      <p className="text-green-400 text-xs">✓ Passwords match</p>
                    )}
                  </div>
                </div>

                {/* Password Requirements */}
                {formData.password && (
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p className="text-gray-400 mb-3 text-sm font-medium">Password Requirements:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                      {Object.entries(passwordRequirements).map(([key, met]) => (
                        <div key={key} className={`flex items-center ${getRequirementColor(met)}`}>
                          <span className="mr-2 font-bold">{getRequirementIcon(met)}</span>
                          {key === "length" && "8+ characters"}
                          {key === "uppercase" && "Uppercase letter"}
                          {key === "lowercase" && "Lowercase letter"}
                          {key === "number" && "Number"}
                          {key === "special" && "Special character"}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* RIGHT SIDE - BUTTONS AND ACTIONS */}
            <div className="lg:w-96 bg-gray-800/50 p-8 lg:p-10 border-t lg:border-t-0 lg:border-l border-gray-700">
              <div className="sticky top-0 space-y-6">
                {/* Google Signup */}
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition"
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  Sign up with Google
                </button>

                {/* Divider */}
                <div className="flex items-center">
                  <div className="flex-grow border-t border-gray-600"></div>
                  <span className="mx-3 text-gray-500 text-sm">or</span>
                  <div className="flex-grow border-t border-gray-600"></div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  onClick={handleSubmit}
                  disabled={isLoading} 
                  className={`w-full px-6 py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg ${
                    isLoading ? "opacity-70 cursor-not-allowed" : "hover:from-blue-600 hover:to-purple-700"
                  } transition-all`}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>

                {/* Login Link */}
                <div className="text-center pt-4 border-t border-gray-700">
                  <p className="text-gray-400">
                    Already have an account?{" "}
                    <button 
                      className="text-blue-400 hover:underline font-medium" 
                      onClick={switchToLogin}
                    >
                      Log in
                    </button>
                  </p>
                </div>

                {/* Password Requirements Info */}
                {!formData.password && (
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm font-medium mb-2">Password must contain:</p>
                    <ul className="text-gray-500 text-xs space-y-1">
                      <li>• At least 8 characters</li>
                      <li>• Uppercase letter</li>
                      <li>• Lowercase letter</li>
                      <li>• Number</li>
                      <li>• Special character</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <ToastContainer theme="dark" />
        </div>
      </div>
    </>
  );
}