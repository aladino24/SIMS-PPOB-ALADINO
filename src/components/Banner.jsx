import { useEffect, useRef, useState } from "react";
import API from "../services/api";

import banner1 from "../assets/Banner-1.png";
import banner2 from "../assets/Banner-2.png";
import banner3 from "../assets/Banner-3.png";
import banner4 from "../assets/Banner-4.png";
import banner5 from "../assets/Banner-5.png";

import arrowLeft from "../assets/left-arrow.png";
import arrowRight from "../assets/right-arrow.png";

function Banner() {

  const scrollRef = useRef(null);
  const [banners, setBanners] = useState([]);

  const defaultBanners = [
    banner1,
    banner2,
    banner3,
    banner4,
    banner5
  ];

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -300,
      behavior: "smooth"
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300,
      behavior: "smooth"
    });
  };

  const getBanners = async () => {
    try {
      const res = await API.get("/banner");
      setBanners(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

  return (
    <div className="banner-container">

      <h3 className="banner-title">Temukan promo menarik</h3>

      <div className="banner-wrapper">

        <img
          src={arrowLeft}
          className="arrow arrow-left"
          onClick={scrollLeft}
          alt="left"
        />

        <div className="banner-scroll" ref={scrollRef}>

          {(banners.length ? banners : defaultBanners).map((banner, index) => (
            <img
              key={index}
              src={banner.banner_image || banner}
              alt={`banner-${index}`}
              className="banner-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultBanners[index];
              }}
            />
          ))}

        </div>

        <img
          src={arrowRight}
          className="arrow arrow-right"
          onClick={scrollRight}
          alt="right"
        />

      </div>

    </div>
  );
}

export default Banner;