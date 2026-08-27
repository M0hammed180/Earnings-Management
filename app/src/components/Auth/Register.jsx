import React, { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Loading from "../Elements/Loading";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [user, setUser] = useState({
    userName: "",
    password: "",
    phone: "",
    role: "user",
    expiresAt: "",
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post("https://earnings-management-production.up.railway.app/user/add", user);
      setUser({
        userName: "",
        password: "",
        phone: "",
        role: "user",
        expiresAt: "",
        name: "",
      });
    } catch (error) {
      if (error.response) {
        console.error("Registration Failed:", error.response.data.error);
        setErrorMessage(error.response.data.error);
      } else {
        console.error("Network Error:", error.message);
        setErrorMessage("Network Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-5 text-gray-800">
      <div className="mx-auto max-w-xl">
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <h1 className="mb-5 border-b border-gray-100 pb-2 text-lg font-bold text-gray-600">
              Create Account
            </h1>

            {errorMessage && (
              <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="mb-1 block text-sm font-bold"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="userName"
                  value={user.userName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-gray-600"
                  required
                />
              </div>

              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-bold">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-gray-600"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-bold">
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-gray-600"
                />
              </div>

              <div>
                <label htmlFor="role" className="mb-1 block text-sm font-bold">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={user.role}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm outline-none focus:border-gray-600"
                >
                  <option value="admin">Admin</option>
                  <option defaultChecked value="user">
                    User
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="expiresAt"
                  className="mb-1 block text-sm font-bold"
                >
                  expiresAt
                </label>
                <input
                  type="date"
                  id="expiresAt"
                  name="expiresAt"
                  value={user.expiresAt}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-gray-600"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-bold"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-gray-600"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-gray-600 py-2.5 font-bold text-white transition hover:bg-gray-700"
                >
                  {loading ? "Loading..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
