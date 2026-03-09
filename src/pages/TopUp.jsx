import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import "./topup.css";
import profilePhoto from "../assets/Profile-Photo.png";
import Swal from "sweetalert2";

function TopUp() {

  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(false);

  const nominalList = [
    10000, 20000, 50000, 100000, 250000, 500000
  ];

  const getProfile = async () => {
    try {
      const res = await API.get("/profile");
      setProfile(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getBalance = async () => {
    try {
      const res = await API.get("/balance");
      setBalance(res.data.data.balance);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
    getBalance();
  }, []);

  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

  const handleTopUp = async () => {

    if (amount < 10000) {
      Swal.fire({
        icon: "warning",
        title: "Nominal tidak valid",
        text: "Minimum Top Up adalah Rp10.000",
      });
      return;
    }

    if (amount > 1000000) {
      Swal.fire({
        icon: "warning",
        title: "Nominal tidak valid",
        text: "Maximum Top Up adalah Rp1.000.000",
      });
      return;
    }

    try {

      const confirm = await Swal.fire({
        title: `Top Up Rp${amount.toLocaleString()} ?`,
        text: "Apakah anda yakin ingin melanjutkan?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#ff3b30",
        cancelButtonColor: "#ccc",
        confirmButtonText: "Ya, lanjutkan",
        cancelButtonText: "Batal"
      });

      if (!confirm.isConfirmed) return;

      setLoading(true);

      await API.post("/topup", {
        top_up_amount: amount
      });

      Swal.fire({
        icon: "success",
        title: "Top Up Berhasil",
        text: "Saldo berhasil ditambahkan"
      });

      setAmount(0);

      getBalance();

    } catch (error) {

      Swal.fire({
        icon: "error",
        title: "Top Up Gagal",
        text: "Terjadi kesalahan pada server"
      });

    } finally {
      setLoading(false);
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
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = profilePhoto;
              }}
            />

            <p>Selamat datang,</p>

            <h2>
              {profile
                ? `${profile.first_name} ${profile.last_name}`
                : "Loading..."}
            </h2>

          </div>

          <div className="balance-card">

            <p>Saldo anda</p>

            <h2>
              {showBalance
                ? `Rp ${balance.toLocaleString()}`
                : "Rp ••••••"}
            </h2>

            <span className="lihat" onClick={toggleBalance}>
              {showBalance ? "Tutup Saldo 👁" : "Lihat Saldo 👁"}
            </span>

          </div>

        </div>

        <div className="topup-section">

          <p>Silahkan masukan</p>
          <h3>Nominal Top Up</h3>

          <div className="topup-input-group">

            <input
              type="number"
              placeholder="masukan nominal Top Up"
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
            />

            <div className="nominal-buttons">

              {nominalList.map((nominal) => (
                <button
                  key={nominal}
                  onClick={() => setAmount(nominal)}
                  className={amount === nominal ? "active" : ""}
                >
                  Rp{nominal.toLocaleString()}
                </button>
              ))}

            </div>

          </div>

          <button
            className="topup-btn"
            disabled={
              amount < 10000 ||
              amount > 1000000 ||
              loading
            }
            onClick={handleTopUp}
          >
            {loading ? "Processing..." : "Top Up"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default TopUp;