import { useEffect, useState } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { sliderData } from "./slider-utils";
import "./slider.scss";
import { MdShoppingCart } from "react-icons/md";


const Slider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
     const slideLength = sliderData.length;
  //   console.log(slideLength);

  const autoScroll = true;
  let slideInterval;
  let intervalTime = 3000;

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slideLength - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slideLength - 1 : currentSlide - 1);
  };

  useEffect(() => {
    setCurrentSlide(0);
  }, []);

  //   const auto = () => {
  //     slideInterval = setInterval(nextSlide, intervalTime);
  //   };

  useEffect(() => {
    if (autoScroll) {
      const auto = () => {
        slideInterval = setInterval(nextSlide, intervalTime);
      };
      auto();
    }
    return () => clearInterval(slideInterval);
  }, [currentSlide, slideInterval, autoScroll]);

  return (
    <div className="slider">
      <AiOutlineArrowLeft className="arrow prev" onClick={prevSlide} />
      <AiOutlineArrowRight className="arrow next" onClick={nextSlide} />

      {sliderData.map((slide, index) => {
        const { image, heading, desc } = slide;
        return (
          <div
            key={index}
            className={index === currentSlide ? "slide current" : "slide"}
          >
            {index === currentSlide && (
              <>
                <img src={image} alt="slide" />
                <div className="content">
                  <h2>{heading}</h2>
                  <p style={{fontWeight: "700"}}>{desc}</p>
                  <hr />
                  <a href="#product" style={{backgroundColor: '#005EB2', display:'flex', gap: '1rem', padding: '1rem 5rem'}} className="--btn --btn-primary">
                    <MdShoppingCart size={25}/> <span>Shop Now</span>
                  </a>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  )
}

export default Slider
