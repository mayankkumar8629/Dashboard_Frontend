import { useState } from 'react';
import { signupUser } from '../../services/authService.js';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignupForm({ switchToLogin }) {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: ''   // NEW FIELD
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

  // =============================
  // INPUT HANDLER
  // =============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError(null);

    if (name === 'password') {
      validatePasswordRequirements(value);
    }
  };

  // =============================
  // PASSWORD RULES
  // =============================
  const validatePasswordRequirements = (password) => {
    setPasswordRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  // =============================
  // FORM VALIDATION
  // =============================
  const validateForm = () => {
    const newErrors = {};

    // Username
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Account Type
    if (!formData.accountType) {
      newErrors.accountType = "Please select an account type";
    }

    // Password
    const pr = passwordRequirements;
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!pr.length || !pr.uppercase || !pr.lowercase || !pr.number || !pr.special) {
      newErrors.password = "Password does not meet all requirements";
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =============================
  // SUBMIT HANDLER
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;

      const response = await signupUser(userData);

      toast.success("Account created successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        accountType: ''
      });

      setTimeout(() => switchToLogin(), 2000);

    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast.error(errorMessage);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setApiError(errorMessage);
      }

    } finally {
      setIsLoading(false);
    }
  };

  const getRequirementColor = (met) => (met ? 'text-green-400' : 'text-red-400');
  const getRequirementIcon = (met) => (met ? '✓' : '✗');

  // ============================================================
  // UI (ACCOUNT TYPE = CIRCLE RADIO BUTTONS)
  // ============================================================

  return (
    <div className="w-full max-w-md bg-gray-900 p-10 rounded-2xl border border-gray-700 shadow-2xl backdrop-blur-sm bg-opacity-90">

      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Create Account
        </h2>
        <p className="text-gray-400 mt-1">Join us today</p>
      </div>

      {/* API ERROR */}
      {apiError && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-sm">
          ⚠ {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* USERNAME */}
        <div className="space-y-1">
          <label className="text-sm text-gray-400">Username</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter a username"
            className={`w-full px-4 py-3 bg-gray-800 border ${
              errors.username ? "border-red-500" : "border-gray-700"
            } rounded-lg text-white placeholder-gray-500`}
          />
          {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
        </div>

        {/* EMAIL */}
        <div className="space-y-1">
          <label className="text-sm text-gray-400">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={`w-full px-4 py-3 bg-gray-800 border ${
              errors.email ? "border-red-500" : "border-gray-700"
            } rounded-lg text-white placeholder-gray-500`}
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        </div>

        {/* ACCOUNT TYPE (Circle Radio Buttons) */}
        <div className="space-y-1">
          <label className="text-sm text-gray-400">Account Type</label>

          <div className="flex items-center gap-6 mt-2">

            {/* Influencer */}
            <label className="flex items-center gap-2 cursor-pointer">
              <span
                className={`w-4 h-4 rounded-full border-2 ${
                  formData.accountType === "INFLUENCER"
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-500"
                }`}
              ></span>
              <input
                type="radio"
                name="accountType"
                value="INFLUENCER"
                checked={formData.accountType === "INFLUENCER"}
                onChange={handleChange}
                className="hidden"
              />
              <span className="text-gray-300">Influencer</span>
            </label>

            {/* Brand */}
            <label className="flex items-center gap-2 cursor-pointer">
              <span
                className={`w-4 h-4 rounded-full border-2 ${
                  formData.accountType === "BRAND"
                    ? "border-purple-500 bg-purple-500"
                    : "border-gray-500"
                }`}
              ></span>
              <input
                type="radio"
                name="accountType"
                value="BRAND"
                checked={formData.accountType === "BRAND"}
                onChange={handleChange}
                className="hidden"
              />
              <span className="text-gray-300">Brand</span>
            </label>
          </div>

          {errors.accountType && <p className="text-red-500 text-xs">{errors.accountType}</p>}
        </div>

        {/* PASSWORD */}
        <div className="space-y-1">
          <label className="text-sm text-gray-400">Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            placeholder="Create a password"
            className={`w-full px-4 py-3 bg-gray-800 border ${
              errors.password ? "border-red-500" : "border-gray-700"
            } rounded-lg text-white`}
          />

          {/* Password Rules Box */}
          {formData.password && (
            <div className="mt-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700 text-xs">
              <p className="text-gray-400 mb-2">Password Requirements:</p>

              {Object.entries(passwordRequirements).map(([key, met]) => (
                <div key={key} className={`flex items-center ${getRequirementColor(met)}`}>
                  <span className="mr-2">{getRequirementIcon(met)}</span>
                  {key === "length" && "At least 8 characters"}
                  {key === "uppercase" && "Contains uppercase letter"}
                  {key === "lowercase" && "Contains lowercase letter"}
                  {key === "number" && "Contains number"}
                  {key === "special" && "Contains special character"}
                </div>
              ))}
            </div>
          )}

          {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="space-y-1">
          <label className="text-sm text-gray-400">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            onChange={handleChange}
            value={formData.confirmPassword}
            placeholder="Confirm your password"
            className={`w-full px-4 py-3 bg-gray-800 border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-700"
            } rounded-lg text-white`}
          />
          
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
          )}

          {formData.confirmPassword &&
            formData.password === formData.confirmPassword &&
            !errors.confirmPassword && (
              <p className="text-green-400 text-xs">✓ Passwords match</p>
            )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full px-6 py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg mt-4 ${
            isLoading ? "opacity-70 cursor-not-allowed" : "hover:from-blue-600 hover:to-purple-700"
          }`}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      {/* Login link */}
      <div className="text-center mt-6 text-gray-400">
        Already have an account?{" "}
        <button className="text-blue-400 hover:underline" onClick={switchToLogin}>
          Log in
        </button>
      </div>

      <ToastContainer theme="dark" />
    </div>
  );
}
