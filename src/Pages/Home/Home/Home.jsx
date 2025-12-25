import React from 'react';
import Banner from '../Banner/Banner';
import Reviews from '../Reviews/Reviews';
import LatestResolvedIssues from '../../LatestResolvedIssue/LatestResolvedIssue';
import reviewsData from '../../../assets/json/reviews.json'; 

const reviewsPromise = Promise.resolve(reviewsData); // wrap in a promise

const Home = () => {
    return (
        <div>
            <Banner />
            <LatestResolvedIssues />
            <Reviews reviewsPromise={reviewsPromise} />
            
        </div>
    );
};

export default Home;
