import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      await login(formData);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setError(error?.message || error || "Unable to log in. Please check your email and password.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-taupe-100">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-2 text-taupe-900 text-center">recollect</h1>
        <p className="text-lg text-taupe-700 mb-8 text-center">Track your library and loans!</p>
      </div>
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-taupe-900">Log in</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && (
            <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <input type="email" id="email" name="email" placeholder="Email" required className="border p-3 rounded-lg" value={formData.email} onChange={handleChange} />
          <input type="password" id="password" name="password" placeholder="Password" required className="border p-3 rounded-lg" value={formData.password} onChange={handleChange} />
          <button className="bg-emerald-900 text-white p-3 rounded-lg hover:bg-emerald-950">Log in</button>
        </form>
        <p className="text-sm text-taupe-700 mt-4 text-center">Don't have an account? <a href="/register" className="text-emerald-700 hover:underline">Register</a></p>
      </div>
    </div>
  );
}
