import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import pbb from "../assets/PBB.png";
import listrik from "../assets/Listrik.png";
import pulsa from "../assets/Pulsa.png";
import pdam from "../assets/PDAM.png";
import pgn from "../assets/PGN.png";
import televisi from "../assets/Televisi.png";
import musik from "../assets/Musik.png";
import voucherGame from "../assets/Game.png";
import voucherMakanan from "../assets/Voucher-Makanan.png";
import qurban from "../assets/Kurban.png";
import zakat from "../assets/Zakat.png";
import paketData from "../assets/Paket-Data.png";

function Services() {

  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  const defaultIcons = {
    PAJAK: pbb,
    PLN: listrik,
    PULSA: pulsa,
    PDAM: pdam,
    PGN: pgn,
    TV: televisi,
    MUSIK: musik,
    VOUCHER_GAME: voucherGame,
    VOUCHER_MAKANAN: voucherMakanan,
    QURBAN: qurban,
    ZAKAT: zakat,
    PAKET_DATA: paketData
  };

  const getServices = async () => {
    try {
      const res = await API.get("/services");
      setServices(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  const handleServiceClick = (service) => {
    navigate("/payment", {
      state: {
        service_code: service.service_code,
        service_name: service.service_name,
        service_icon: service.service_icon || defaultIcons[service.service_code],
        service_tariff: service.service_tariff
      }
    });
  };

  return (
    <div className="services">
      {services.map((service) => (

        <div
          key={service.service_code}
          className="service-item"
          onClick={() => handleServiceClick(service)}
        >

          <img
            src={service.service_icon}
            alt={service.service_name}
            className="service-icon"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultIcons[service.service_code];
            }}
          />

          <p>{service.service_name}</p>

        </div>

      ))}
    </div>
  );
}

export default Services;