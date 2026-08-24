import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <div class="shadow bg-white">
        <div class="h-16 mx-auto px-5 flex items-center justify-between">
          <Link class="text-2xl hover:text-cyan-500 transition-colors cursor-pointer">
            Logo
          </Link>

          <ul class="flex items-center gap-5">
            <li>
              <Link class="hover:text-cyan-500 transition-colors" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link class="hover:text-cyan-500 transition-colors" to="/login">
                Login
              </Link>
            </li>
            <li>
              <Link class="hover:text-cyan-500 transition-colors" to="/register">
                register
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
