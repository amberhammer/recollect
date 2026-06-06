import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-taupe-100">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-2 text-taupe-900 text-center">recollect</h1>
        <p className="text-lg text-taupe-700 mb-8 text-center">Track your library and loans!</p>
      </div>
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-taupe-900">Register</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input type="text" id="username" name="username" placeholder="Username" required className="border p-3 rounded-lg" value={formData.username} onChange={handleChange} />
          <input type="email" id="email" name="email" placeholder="Email" required className="border p-3 rounded-lg" value={formData.email} onChange={handleChange} />
          <input type="password" id="password" name="password" placeholder="Password" required className="border p-3 rounded-lg" value={formData.password} onChange={handleChange} />
          <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" required className="border p-3 rounded-lg" value={formData.confirmPassword} onChange={handleChange} />
          <button className="bg-emerald-900 text-white p-3 rounded-lg hover:bg-emerald-950">Register</button>
        </form>
        <p className="text-sm text-taupe-700 mt-4 text-center">Already have an account? <a href="/login" className="text-emerald-700 hover:underline">Log in</a></p>
      </div>
    </div>
  );
}