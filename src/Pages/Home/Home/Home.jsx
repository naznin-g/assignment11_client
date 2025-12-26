import React from 'react';
import Banner from '../Banner/Banner';
import Reviews from '../Reviews/Reviews';
import LatestResolvedIssues from '../../LatestResolvedIssue/LatestResolvedIssue';


const reviewsPromise = fetch('/reviews.json').then(res => res.json());

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
