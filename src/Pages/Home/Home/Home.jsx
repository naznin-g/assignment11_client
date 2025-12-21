import React from 'react';

//import Brands from '../Brands/Brands';
import Reviews from '../Reviews/Reviews';

import Banner from '../Banner/Banner';

const reviewsPromise = fetch('/reviews.json').then(res => res.json());

const Home = () => {
    return (
        <div>
            <Banner></Banner>
           // <Brands></Brands>
            <Reviews reviewsPromise={reviewsPromise}></Reviews>
        </div>
    );
};

export default Home;