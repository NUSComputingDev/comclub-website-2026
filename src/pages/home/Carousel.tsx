import React from 'react';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';
import Slider, { CustomArrowProps, Settings } from 'react-slick';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config.js';
import AnnouncementsCard from './AnnouncementsCard';
import announcements from './announcements.json' with {type: 'json'};
import './Carousel.css';

function NextArrow(props: CustomArrowProps) {
  const { className, onClick } = props;
  return (
    <div
      className={className}
      onClick={onClick}>
      <GoChevronRight className='arrows' />
    </div>
  );
}

function PrevArrow(props: CustomArrowProps) {
  const { className, onClick } = props;
  return (
    <div
      className={className}
      onClick={onClick}>
      <GoChevronLeft className='arrows' />
    </div>
  );
}

function Carousel() {
  const breakpoints = resolveConfig(tailwindConfig).theme.screens;
  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    centerMode: false,
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: parseInt(breakpoints['md'].replace('px', '')),
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0,
          centerMode: true,
          arrows: false,
        },
      },
      {
        breakpoint: parseInt(breakpoints['lg'].replace('px', '')),
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 0,
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className='slider-container'>
      <Slider {...settings}>
        {
          announcements.map((announcement, index) => (
            <div className='item' key={index}>
              <AnnouncementsCard
                title={announcement.title}
                desc={announcement.desc}
                date={announcement.date}
                imgSrc={announcement.imgSrc}
                link={announcement.link}
              />
            </div>
          ))
        }
      </Slider>
    </div>
  );
}

export default Carousel;
