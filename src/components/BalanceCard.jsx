import { useEffect, useState } from "react";
import API from "../services/api";
import profilePhoto from "../assets/Profile-Photo.png";

function BalanceCard() {

  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(false);

  useEffect(() => {
    getProfile();
    getBalance();
  }, []);

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

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID").format(value);
  };

  return (
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
            ? `Rp ${formatRupiah(balance)}`
            : "Rp •••••••"}
        </h2>

        <span
          className="lihat"
          onClick={() => setShowBalance(!showBalance)}
        >
          {showBalance ? "Tutup Saldo" : "Lihat Saldo"}
        </span>

      </div>

    </div>
  );
}

export default BalanceCard;