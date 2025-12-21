import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
const banners = [
    "https://ibb.co.com/8gbw8S4q",
    "https://ibb.co.com/WvXrhc8s",
    "https://ibb.co.com/Z6ZLxFjZ"
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