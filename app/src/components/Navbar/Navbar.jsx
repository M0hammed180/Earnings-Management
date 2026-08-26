import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Redux/userSlice";
import { FiMoon, FiSun } from "react-icons/fi";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark",
  );
  const { isAuthenticated, role } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDarkMode);
    root.style.colorScheme = isDarkMode ? "dark" : "light";
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const closeMenu = () => setIsMenuOpen(false);
  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
  };

  const navigationLinks = (
    <>
      <Link
        onClick={closeMenu}
        className="rounded px-3 py-2 text-sm font-medium transition hover:bg-gray-100 hover:text-gray-900"
        to="/"
      >
        Home
      </Link>
      {role === "admin" && (
        <>
          <Link
            onClick={closeMenu}
            className="rounded px-3 py-2 text-sm font-medium transition hover:bg-gray-100 hover:text-gray-900"
            to="/newtransaction"
          >
            New Transaction
          </Link>
          <Link
            onClick={closeMenu}
            className="rounded px-3 py-2 text-sm font-medium transition hover:bg-gray-100 hover:text-gray-900"
            to="/register"
          >
            Create User
          </Link>
          <Link
            onClick={closeMenu}
            className="rounded px-3 py-2 text-sm font-medium transition hover:bg-gray-100 hover:text-gray-900"
            to="/users"
          >
            Show Users
          </Link>
        </>
      )}
      {isAuthenticated ? (
        <button
          type="button"
          onClick={handleLogout}
          className="rounded px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
        >
          Logout
        </button>
      ) : (
        <Link
          onClick={closeMenu}
          className="rounded px-3 py-2 text-sm font-medium transition hover:bg-gray-100 hover:text-gray-900"
          to="/login"
        >
          Login
        </Link>
      )}
      <button
        type="button"
        onClick={() => setIsDarkMode((darkMode) => !darkMode)}
        className="hidden rounded-4xl px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 md:inline-flex"
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        title={isDarkMode ? "Light mode" : "Dark mode"}
      >
        {isDarkMode ? (
          <div className="flex items-center">
            <FiSun /> Light
          </div>
        ) : (
          <div className="flex items-center">
            <FiMoon /> Dark
          </div>
        )}
      </button>
    </>
  );

  return (
    <header className="relative z-50 border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="text-lg font-bold text-gray-900 transition hover:text-gray-600"
        >
          Cash Management
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navigationLinks}
        </nav>
        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={() => setIsDarkMode((darkMode) => !darkMode)}
            className="rounded-lg p-2 text-sm text-gray-700 transition hover:bg-gray-100"
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            title={isDarkMode ? "Light mode" : "Dark mode"}
          >
            {isDarkMode ? "☀" : "☾"}
          </button>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 transition hover:bg-gray-100"
          >
            <span className="sr-only">Toggle navigation menu</span>
            <span className="text-2xl leading-none" aria-hidden="true">
              {isMenuOpen ? "×" : "☰"}
            </span>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <nav
          id="mobile-navigation"
          className="absolute left-0 right-0 top-full border-b border-gray-200 bg-white px-4 py-3 shadow-lg md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigationLinks}
          </div>
        </nav>
      )}
    </header>
  );
}
