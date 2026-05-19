import { useForm } from "react-hook-form";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  CheckCircle2,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await API.post("/auth/register", data);
      navigate("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      const status = error.response?.status;
      if (status === 400) {
        alert(`User already exists`);
      } else if (status === 422) {
        alert("Invalid email or password.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side: Branding/Info (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-black p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <CheckCircle2 className="text-black" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Civic Connect
            </span>
          </div>

          <h2 className="text-5xl font-black leading-tight mb-6">
            Make your <br />
            <span className="text-zinc-500">community</span> better.
          </h2>
          <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
            Join thousands of residents in Patna reporting local issues and
            tracking civic improvements in real-time.
          </p>
        </div>

        <div className="relative z-10 bg-zinc-900/50 backdrop-blur-sm p-6 rounded-2xl border border-zinc-800 inline-block self-start">
          <p className="text-sm font-medium">
            "Reporting a broken streetlight took me 30 seconds. Fixed in 2
            days."
          </p>
          <p className="text-xs text-zinc-500 mt-2">
            — Local Resident, Kankarbagh
          </p>
        </div>

        {/* Decorative background element */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-zinc-800 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Right Side: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
              Create Account
            </h1>
            <p className="text-zinc-500 mt-2">Join the civic platform today.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 ml-1">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="John Doe"
                  className={`w-full pl-12 pr-4 py-4 bg-zinc-50 border-2 rounded-2xl outline-none transition-all ${errors.name ? "border-red-200 focus:border-red-500" : "border-zinc-100 focus:border-black"}`}
                  {...register("name", { required: "Name is required" })}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.name.message as string}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="john@example.com"
                  className={`w-full pl-12 pr-4 py-4 bg-zinc-50 border-2 rounded-2xl outline-none transition-all ${errors.email ? "border-red-200 focus:border-red-500" : "border-zinc-100 focus:border-black"}`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.email.message as string}
                </p>
              )}
            </div>

            {/* Password with your Regex */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-4 py-4 bg-zinc-50 border-2 rounded-2xl outline-none transition-all ${errors.password ? "border-red-200 focus:border-red-500" : "border-zinc-100 focus:border-black"}`}
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value:
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,
                      message:
                        "Must be 8-15 chars with A-Z, a-z, 0-9 & special char",
                    },
                  })}
                />
              </div>
              {errors.password ? (
                <p className="text-red-500 text-[10px] mt-1 ml-1 leading-tight flex items-start gap-1">
                  <AlertCircle size={10} className="mt-0.5 shrink-0" />
                  {errors.password.message as string}
                </p>
              ) : (
                <p className="text-[10px] text-zinc-400 mt-2 ml-1">
                  Use 8-15 characters with a mix of letters, numbers & symbols.
                </p>
              )}
            </div>

            <button
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-zinc-800 active:scale-95 shadow-xl shadow-black/10 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-black font-bold hover:underline underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
