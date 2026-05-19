import { useForm } from "react-hook-form";
import API from "../api/axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminLogin = () => {
  const { register, handleSubmit } = useForm();

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    data.role = "admin";
    try {
      const response = await API.post("/auth/login", data);

      login(response.data.user, response.data.token, "ADMIN");

      navigate("/admin");
    } catch (error: any) {
      alert(error.message || "Login failed");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-lg w-100"
      >
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          {...register("email")}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          {...register("password")}
        />

        <button className="w-full bg-black text-white py-3 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
