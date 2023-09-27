import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Sdata from "./slideData";

export default function SlideCard() {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    appendDots: (dots) => {
      return <ul style={{ margin: "10px"}}>{dots}</ul>;
    },
  };
  return (
    <>
      <Slider {...settings}>
        {Sdata.map((value, index) => (
            <div key={value.id}>
              <div className="box d_flex top" >
                <div className="left">
                  <h1 className="mb-5" style={{fontSize:40}}>{value.title}</h1>
                  <p className="mb-3" style={{fontSize:17}}>{value.desc}</p>
                  <button className="btn-primary">Visit Collections</button>
                </div>
                <div className="right">
                  <img src={value.cover} alt="" />
                </div>
              </div>
            </div>
        ))}
      </Slider>
    </>
  );
}
