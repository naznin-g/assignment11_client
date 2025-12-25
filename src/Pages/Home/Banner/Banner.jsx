import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
const banners = [
    "https://i.postimg.cc/sgLnFVxc/Ass11-banner1.jpg",
    "https://i.postimg.cc/76knDbk2/Ass11-banner2.jpg",
    "https://i.postimg.cc/gjBhw2Cb/Ass11-banner3.jpg"
];

const Banner = () => {
    return (
        <Carousel autoPlay infiniteLoop>
            {banners.map((img, index) => (
                <div key={index}>
                    <img src={img} alt={`Banner ${index + 1}`} />
                </div>
            ))}
        </Carousel>
    );
};

export default Banner;