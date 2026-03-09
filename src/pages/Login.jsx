import { useState, useEffect } from "react";
import "./Login.css";
import logo from "../assets/logo.png";
import illustration from "../assets/Illustrasi-Login.png";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import Swal from "sweetalert2";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await API.post("/login", {
        email,
        password
      });

      const token = res.data.data.token;

      localStorage.setItem("token", token);

      await Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: "Selamat datang kembali",
        confirmButtonColor: "#ff3b30"
      });

      navigate("/dashboard");

    } catch (error) {
      const message =
        error.response?.data?.message || "Login gagal";

      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: message,
        confirmButtonColor: "#ff3b30"
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <div className="login-left">

        <div className="logo-title">
          <img src={logo} alt="logo" className="logo"/>
          <span>SIMS PPOB</span>
        </div>

        <h2 className="login-heading">
          Masuk atau buat akun<br/>untuk memulai
        </h2>

        <form className="login-form" onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="masukan email anda"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="masukan password anda"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Masuk"}
          </button>

        </form>

        <p className="register-text">
          belum punya akun? registrasi <Link to="/register">di sini</Link>
        </p>

      </div>

      <div className="login-right">
        <img src={illustration} alt="illustration"/>
      </div>

    </div>
  );
}

export default Login;