import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, EyeOff, Eye, ArrowRight } from "lucide-react";
import ContactAdminModal from "../../components/auth/ContactAdminModal";
import Button from "../../components/common/Button";
import {useAuth} from '../../context/AuthContext.jsx';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showContactAdmin, setShowContactAdmin] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      const loggedInUser = response;

      if(!loggedInUser?.role) {
        throw new Error("Invalid user role.");
      };

      const role = loggedInUser.role.toLowerCase();

      if(!["admin", "teacher", "student"].includes(role)) {
        throw new Error(`Unknown user role: ${role}. Cannot navigate.`);
      }

      //role-based redirect
      if(role === "admin") {
        navigate("/admin/dashboard");
      } else if(role === "teacher") {
        navigate("/teacher/dashboard");
      } else if (role === "student") {
        navigate("/student/dashboard");
      }

    } catch (error) {
      console.error("Login failed:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to login. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center bg-slate-50">
      {/* Right - Login Form */}
      <div className="w-full flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Vigilo</h1>
              <p className="text-sm text-slate-500">Super Proctoring System</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 mt-1">
              Sign in to your proctoring dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              {/* <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label> */}
              <Link
                to="/forgot-password"
                type="button"
                className="text-sm text-indigo-600 font-medium hover:text-indigo-700"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => setShowContactAdmin(true)}
              className="text-indigo-600 font-medium hover:text-indigo-700 cursor-pointer"
            >
              Contact Admin
            </button>
          </p>
        </div>
      </div>
      {showContactAdmin && (
        <ContactAdminModal onClose={() => setShowContactAdmin(false)} />
      )}
    </div>
  );
};

export default Login;
