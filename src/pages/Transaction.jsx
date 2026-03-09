import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import "./transaction.css";
import profilePhoto from "../assets/Profile-Photo.png";

function Transaction() {

  const limit = 5;

  const [offset, setOffset] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(false);

  // format tanggal
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  // format waktu
  const formatTime = (date) => {
    return (
      new Date(date).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit"
      }) + " WIB"
    );
  };

  // ambil profile
  const getProfile = async () => {
    try {
      const res = await API.get("/profile");
      setProfile(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ambil saldo
  const getBalance = async () => {
    try {
      const res = await API.get("/balance");
      setBalance(res.data.data.balance);
    } catch (error) {
      console.log(error);
    }
  };

  const getTransactions = async (newOffset = 0) => {
    try {

      const res = await API.get(`/transaction/history?limit=${limit}&offset=${newOffset}`);

      const data = res.data.data.records;

      if (data.length < limit) {
        setHasMore(false);
      }

      if (newOffset === 0) {
        setTransactions(data);
      } else {
        setTransactions((prev) => [...prev, ...data]);
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
    getBalance();
    getTransactions(0);
  }, []);

  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

  const handleShowMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    getTransactions(newOffset);
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

        <div className="transaction-section">

          <h3>Semua Transaksi</h3>

          {transactions.map((item) => (

            <div className="transaction-item" key={item.invoice_number}>

              <div>

                <h4 className={item.transaction_type === "TOPUP" ? "plus" : "minus"}>
                  {item.transaction_type === "TOPUP" ? "+" : "-"} Rp {item.total_amount.toLocaleString()}
                </h4>

                <p className="date">
                  {formatDate(item.created_on)} {formatTime(item.created_on)}
                </p>

              </div>

              <div className="desc">
                {item.description}
              </div>

            </div>

          ))}

          {hasMore && (
            <p
              className="show-more"
              onClick={handleShowMore}
            >
              Show more
            </p>
          )}

        </div>

      </div>

    </div>
  );
}

export default Transaction;