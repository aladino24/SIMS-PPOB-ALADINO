import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import profilePhoto from "../assets/Profile-Photo.png";
import Swal from "sweetalert2";
import "./payment.css";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const { service_code, service_name, service_icon, service_tariff } = location.state;

  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(false);

  const getProfile = async () => {
    try {
      const res = await API.get("/profile");
      setProfile(res.data.data);
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Gagal mengambil profil", error);
    }
  };

  const getBalance = async () => {
    try {
      const res = await API.get("/balance");
      setBalance(res.data.data.balance);
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Gagal mengambil saldo", error);
    }
  };

  useEffect(() => {
    getProfile();
    getBalance();
  }, []);

  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

  const handlePay = async () => {
  const result = await Swal.fire({
    title: "Konfirmasi Pembayaran",
    html: `
      <div style="text-align:left;">
        <p><strong>Service:</strong> ${service_name}</p>
        <p><strong>Jumlah:</strong> Rp ${service_tariff.toLocaleString()}</p>
      </div>
    `,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, bayar",
    cancelButtonText: "Batal",
  });

  if (result.isConfirmed) {
    Swal.fire({
      title: "Memproses pembayaran...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const res = await API.post("/transaction", {
        service_code: service_code,
        amount: service_tariff,
      });

      Swal.close(); 

      if (res.data.status === 0) {
        Swal.fire("Berhasil!", res.data.message || "Pembayaran berhasil", "success")
          .then(() => {
            navigate("/dashboard");
          });
      } else {
        Swal.fire("Gagal", res.data.message || "Pembayaran gagal", "error");
      }
    } catch (error) {
      console.log(error);
      Swal.close();
      Swal.fire("Error", error.response?.data?.message || "Terjadi kesalahan saat membayar", "error");
    }
  }
};

  return (
    <div>
      <Navbar />
      <div className="container">

        <div className="balance-wrapper">
          <div className="welcome-section">
            <img
              src={profile?.profile_image || profilePhoto}
              alt="profile"
              className="profile-img"
            />
            <p>Selamat datang,</p>
            <h2>{profile?.first_name} {profile?.last_name}</h2>
          </div>

          <div className="balance-card">
            <p>Saldo anda</p>
            <h2>
              {showBalance ? `Rp ${balance.toLocaleString()}` : "Rp ••••••"}
            </h2>
            <span onClick={toggleBalance}>
              {showBalance ? "Tutup Saldo 👁" : "Lihat Saldo 👁"}
            </span>
          </div>
        </div>

        <div className="payment-section">
          <h3>Pembayaran</h3>

          <div className="service-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={service_icon}
              alt={service_name}
              className="service-icon"
            />
            <p className="service-name">{service_name}</p>
          </div>

          <input
            type="text"
            value={`Rp ${service_tariff?.toLocaleString()}`}
            readOnly
            className="amount-input"
          />

          <button
            className="pay-btn"
            onClick={handlePay}
          >
            Bayar
          </button>

        </div>
      </div>
    </div>
  );
}

export default Payment;