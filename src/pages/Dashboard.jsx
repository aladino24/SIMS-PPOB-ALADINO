import Navbar from "../components/Navbar";
import BalanceCard from "../components/BalanceCard";
import Services from "../components/Services";
import Banner from "../components/Banner";
import "../styles/dashboard.css";

function Dashboard() {
  return (
    <div>

      <Navbar />

      <div className="container">

        <BalanceCard />

        <Services />

        <Banner />

      </div>

    </div>
  );
}

export default Dashboard;