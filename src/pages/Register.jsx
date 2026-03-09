import { useForm } from "react-hook-form";
import API from "../services/api";
import "./register.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {

      const res = await API.post("/registration", {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        password: data.password,
      });

      await Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil",
        text: "Silakan login menggunakan akun Anda",
        confirmButtonColor: "#ff3b30",
        confirmButtonText: "Login"
      });

      navigate("/");

    } catch (error) {

      const message =
        error.response?.data?.message || "Registrasi gagal";

      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: message,
        confirmButtonColor: "#ff3b30"
      });

    }
  };

  return (
    <div className="register-container">

      <div className="register-left">

        <div className="register-header">
          <div className="logo-title">
            <img src="/src/assets/Logo.png" alt="logo" className="logo" />
            <h2>SIMS PPOB</h2>
          </div>

          <h2>Lengkapi data untuk membuat akun</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>

          <input
            placeholder="masukkan email anda"
            {...register("email", { required: true })}
          />
          {errors.email && <p className="error">Email wajib diisi</p>}

          <input
            placeholder="nama depan"
            {...register("firstName", { required: true })}
          />
          {errors.firstName && <p className="error">Nama depan wajib diisi</p>}

          <input
            placeholder="nama belakang"
            {...register("lastName", { required: true })}
          />
          {errors.lastName && <p className="error">Nama belakang wajib diisi</p>}

          <input
            type="password"
            placeholder="buat password"
            {...register("password", { required: true, minLength: 8 })}
          />
          {errors.password && (
            <p className="error">Password minimal 8 karakter</p>
          )}

          <input
            type="password"
            placeholder="konfirmasi password"
            {...register("confirmPassword", {
              validate: (value) =>
                value === watch("password") || "Password tidak sama",
            })}
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword.message}</p>
          )}

          <button type="submit">Registrasi</button>

        </form>

        <p className="login-text">
          sudah punya akun? <a href="/">login di sini</a>
        </p>

      </div>

      <div className="register-right">
        <img src="/src/assets/Illustrasi-Login.png" alt="register" />
      </div>

    </div>
  );
}