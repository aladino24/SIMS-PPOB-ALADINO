import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import TopUp from "../pages/TopUp";
import Transaction from "../pages/Transaction";
import Akun from "../pages/Akun";
import Payment from "../pages/Payment";

import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/topup"
          element={
            <PrivateRoute>
              <TopUp />
            </PrivateRoute>
          }
        />

        <Route
          path="/transaction"
          element={
            <PrivateRoute>
              <Transaction />
            </PrivateRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <PrivateRoute>
              <Payment />
            </PrivateRoute>
          }
        />

        <Route
          path="/akun"
          element={
            <PrivateRoute>
              <Akun />
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;