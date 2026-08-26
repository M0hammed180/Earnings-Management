import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import "./App.css";
import Home from "./components/Home/Home";
import { Provider, useSelector } from "react-redux";
import reduxstore from "./components/Redux/reduxStore";
import Users from "./components/Users/Users";
import NewTransaction from "./components/NewTransaction/NewTransaction";

function App() {
  return (
    <>
      <Provider store={reduxstore}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/users" element={<Users />} />
            <Route path="/newtransaction" element={<NewTransaction />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
