import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./Auth/Signup";
import Login from "./Auth/Login";
import UpdatePassword from "./Auth/Update";
import Home from "./Home";

const App = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/update-password" element={<UpdatePassword />} />
    </Routes>
  );
};

export default App;
