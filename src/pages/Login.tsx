// import { useForm } from "react-hook-form";
// import API from "../api/axios";
// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const Login = ({ isAdmin }: { isAdmin: boolean }) => {
//   const { register, handleSubmit } = useForm();

//   const { login } = useContext(AuthContext);

//   const navigate = useNavigate();

//   const onSubmit = async (data: any) => {
//     data.role = isAdmin ? "ADMIN" : "USER";
//     try {
//       const response = await API.post("/auth/login", data);

//       login(response.data.user, response.data.token, data.role);

//       const pathToNavigate = isAdmin ? "/admin/dashboard" : "/dashboard";
//       navigate(pathToNavigate);
//     } catch (error: any) {
//       console.error("Feedback error:", error);
//       if (error.response && [404].includes(error.response.status)) {
//         alert(`${isAdmin ? "Admin" : "User"} does not exist with this email`);
//       } else if (error.response && [400].includes(error.response.status)) {
//         alert(`Invalid Credentials`);
//       } else if (error.response && [422].includes(error.response.status)) {
//         alert("Invalid Payload");
//       } else {
//         alert(error.message || "Login failed");
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="bg-white p-8 rounded-xl shadow-lg w-100"
//       >
//         <h1 className="text-2xl font-bold mb-6">Login</h1>

//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full border p-3 rounded mb-4"
//           {...register("email")}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full border p-3 rounded mb-4"
//           {...register("password")}
//         />

//         <button className="w-full bg-black text-white py-3 rounded">
//           Login
//         </button>
//         {!isAdmin && (
//           <p className="text-center mt-4">
//             Don't have an account?{" "}
//             <a href="/register" className="text-blue-500">
//               Register
//             </a>
//           </p>
//         )}
//       </form>
//     </div>
//   );
// };

// export default Login;

import { useForm } from "react-hook-form";
import API from "../api/axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

const Login = ({ isAdmin }: { isAdmin: boolean }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    setLoading(true);
    data.role = isAdmin ? "ADMIN" : "USER";
    try {
      const response = await API.post("/auth/login", data);
      login(response.data.user, response.data.token, data.role);
      navigate(isAdmin ? "/admin/dashboard" : "/dashboard");
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 404) {
        alert(`${isAdmin ? "Admin" : "User"} account not found.`);
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
    <div
      className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-500 ${isAdmin ? "bg-zinc-950" : "bg-gray-50"}`}
    >
      <div className="w-full max-w-md">
        {/* Logo / Header Area */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-2xl ${isAdmin ? "bg-white text-black" : "bg-black text-white"}`}
          >
            {isAdmin ? <ShieldCheck size={32} /> : <Lock size={32} />}
          </div>
          <h1
            className={`text-3xl font-black tracking-tight ${isAdmin ? "text-white" : "text-zinc-900"}`}
          >
            {isAdmin ? "Admin Portal" : "Civic Connect"}
          </h1>
          <p
            className={`mt-2 text-sm ${isAdmin ? "text-zinc-500" : "text-gray-500"}`}
          >
            {isAdmin
              ? "Authorized personnel only"
              : "Welcome back to your community"}
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`p-8 rounded-3xl shadow-2xl border transition-all duration-300 ${isAdmin ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}
        >
          <div className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                className={`block text-[10px] font-bold uppercase tracking-widest mb-2 ml-1 ${isAdmin ? "text-zinc-500" : "text-gray-400"}`}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className={`w-full pl-12 pr-4 py-3.5 rounded-2xl outline-none transition-all border-2 ${
                    isAdmin
                      ? "bg-zinc-800 border-zinc-700 text-white focus:border-white"
                      : "bg-gray-50 border-gray-100 focus:border-black"
                  } ${errors.email ? "border-red-500" : ""}`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Enter a valid email",
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

            {/* Password Field */}
            <div>
              <label
                className={`block text-[10px] font-bold uppercase tracking-widest mb-2 ml-1 ${isAdmin ? "text-zinc-500" : "text-gray-400"}`}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3.5 rounded-2xl outline-none transition-all border-2 ${
                    isAdmin
                      ? "bg-zinc-800 border-zinc-700 text-white focus:border-white"
                      : "bg-gray-50 border-gray-100 focus:border-black"
                  } ${errors.password ? "border-red-500" : ""}`}
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value:
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,
                      message:
                        "Password must be 8-15 characters with uppercase, lowercase, number, and special character",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.password.message as string}
                </p>
              )}
            </div>

            {/* Login Button */}
            <button
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 mt-2 ${
                isAdmin
                  ? "bg-white text-black hover:bg-zinc-200"
                  : "bg-black text-white hover:bg-zinc-800 shadow-xl shadow-black/10"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          {!isAdmin ? (
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-black font-bold hover:underline underline-offset-4"
              >
                Register
              </Link>
            </p>
          ) : (
            <Link
              to="/login"
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              Standard User Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
